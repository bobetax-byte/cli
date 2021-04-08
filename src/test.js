const shell = require('shelljs')
const { log, ifPathExit, getOnlineVersion } = require('./utils')

if (ifPathExit('src')) {
  log('ganha')
} else {
  log('diu')
}

// https://api.github.com/repos/bobetax-byte/bobetax-cli-templates/contents/package.json

getOnlineVersion('https://raw.githubusercontent.com/bobetax-byte/bobetax-cli-templates/vue-h5-project/package.json')

log(`there is no package manager in your environment。\n please install a package manager such like npm. \/n cd 'sss' \/n npm i `)

// shell.echo('begin')
// shell.echo('-n', 'begin')
// shell.cd('src')
// shell.exec('pwd')
// shell.echo('执行')
// shell.exec('node echo.js')
// shell.exit(1)

