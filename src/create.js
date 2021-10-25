const { promisify } = require('util');
const path = require('path')
const fs = require('fs');
const Inquirer = require('inquirer')
const shell = require('shelljs');
const downLoadGit = require('download-git-repo');
let ncp = require('ncp'); 

// 初始化 下载
const { downLoadDir } = require('./download');
const { downFetchLoading, ifPathExit, log, getPackageMangerList } = require('./utils');
downLoadGitFunc = promisify(downLoadGit);
const ora = require('ora');
ncp = promisify(ncp);

// 模板渲染阶段
const MetalSmith = require('metalsmith');
let { render } = require('consolidate').ejs;
render = promisify(render)

const download = async (repo,tag) => {
  let api = `bobetax-byte/bobetax-cli-templates`; // 下载项目
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downLoadDir}/${repo}`; // 将模板下载到对应的目录中
  // 首先判断，对应的目录下是否存在对应的目录,并且判断对应的版本是否需要更新
  // if (!ifPathExit(repo, downLoadDir)) {
    await downLoadGitFunc(api, dest);
  // }
  return dest; // 返回下载目录
}

module.exports = async (projectName) => {
  // 首先判断当前环境是否存在同名的文件名称
  if (ifPathExit(projectName)) {
    const result = await Inquirer.prompt({
      type: "list",
      choices: ["yes", "no"],
      name: "overwrite",
      message: "there has a same name directory, Do yuo want to overwrite it?",
    })
    if(result.overwrite === 'no') return
  }

  const target = await downFetchLoading(download, 'loading template...')('vue-h5-project', 'vue-h5-project')
  const projectPath = path.join(path.resolve(), projectName)
  
  // 没有 question 文件，不需要编译，直接执行
  if (!fs.existsSync(path.join(target, 'question.js'))) {
    const spinner = ora('Loading templates').start();
    // copy files
    await ncp(target, projectPath);
    spinner.succeed()
  } else {
    // 有 ，继续修改文件
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(target)
        .destination(projectPath)
        .use(async (files, metal, done) => {
          const result = await Inquirer.prompt(require(path.join(target, 'question.js')))
          const data = metal.metadata()
          // 模板项目名称注入
          data.name = projectName
          Object.assign(data, result)
          delete files['question.js'];
          done();
        })
        .use((files, metal, done) => {
          Reflect.ownKeys(files).forEach(async (item) => {
            let content = files[item].contents.toString(); // 获取文件内容
            // 判断模板属性
            if (item.includes('.js') || item.includes('.json')) {
              // 模板属性渲染
              content = await render(content, metal.metadata());
              // 复写
              files[item].contents = Buffer.from(content);
            }
          })
          done();
        })
        .build(async() => {
          // 选取当前环境执行变量，yarn,npm ,cnpm,
          const choices = getPackageMangerList()
          // 如果当前用户环境没有对应的包管理器，那么跳过。
          if (!choices.length) {
            log(`There is no package manager in your environment.
            Please install a package manager such like npm. then go next.
            cd ${projectName}
            npm i `)
            return
          }
          const { package: packageName } = await Inquirer.prompt({
            type: 'list',
            choices,
            name: 'package',
            message: 'change your package manager'
          })
          const scriptOrder = {
            'pnpm': 'pnpm i',
            'yarn': 'yarn',
            'npm': 'npm i',
            'cnpm': 'cnpm i'
          }
          const spinner = ora('packages install...').start();
          // 进入到当前的环境命令
          shell.cd(projectName)
          shell.exec('pwd')
          shell.exec(scriptOrder[packageName], function(code, stdout, stderr) {
            shell.echo('Exit code:', code);
            shell.echo('Program output:', stdout);
            shell.echo('Program stderr:', stderr);
            if (code !== 0) {
              console.error(error)
              reject()
            }
            resolve()
          });
          spinner.succeed()
          shell.exit(1)
        })
    }) 
  }
};