#! /usr/bin / env node
const program = require('commander');
const path = require('path')
const { version } = require('./utils')
const actionMaps = {
  // 创建项目模板
  create: {
    description: 'create project',
    alias: 'cr',
    example: [
      'bobetax-cli create <projectName>'
    ]
  },
  component: {
    description: 'component componentName',
    alias: 'createCo',
    example: [
      'bobetax-cli component <componentName>'
    ]
  }
}

// 循环创建命令
Object.entries(actionMaps).forEach(([action, config]) => {
  program.command(action)
    .alias(config.alias)
    .description(config.description)
    .action(() => {
      if (action === '*') { // 如果动作没匹配到说明输入有误
        console.log(config.description);
      } else {
        // 引用对应的动作文件 将参数传入
        require(path.resolve(__dirname, action))(...process.argv.slice(3));
      }
    })
})

program.version(version)
  .parse(process.argv)

