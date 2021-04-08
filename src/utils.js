const { name, version } = require('../package.json')
const ora = require('ora');
const fs = require('fs')
const shell = require('shelljs');
const path = require('path')
const chalk = require('chalk')
const request = require('request');

const downFetchLoading = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start();
  const r = await fn(...args);
  spinner.succeed();
  return r
}

/**
 * @description 返回当前执行命令下对应的文件夹是否存在，并加以判断
 * @param {*String} dirName 文件夹名称
 * @returns {*Boolean}
 */
const ifPathExit = (dirName, pathDir = process.cwd()) => {
  try {
    const dirPath = path.join(pathDir, dirName)
    fs.accessSync(dirPath ,fs.constants.R_OK | fs.constants.W_OK);
  }catch(e){
    return false;
  }
  return true;
}

/**
 * @description chalk包装
 * @param {*String} message 消息
 * @param {*String} style 默认样式
 */
const log = ( message, style='red') => {
  console.log(chalk[style](message))
}

/**
 * @description 获取用户环境的默认包名
 * @returns {*Array} 环境包名
 */
const getPackageMangerList = function () {
  const choices = []
  const defaultChoices = ['npm', 'yarn', 'cnpm', 'pnpm']
  defaultChoices.forEach(choice => {
    if (shell.which(choice)) {
      choices.push(choice)
    }
  })
  return choices
}


const getOnlineVersion = function (path) {
  // 
  const dataJson = []
  request(path)
    .on('data', (data) => {
      console.log('data->',data)
      dataJson.push(data)
    })
    .on('end', function () {
      body = Buffer.concat(dataJson).toString();
      console.log('end->', body)
    })
  console.log(dataJson)
}

module.exports = {
  name,
  version,
  downFetchLoading,
  ifPathExit,
  log,
  getPackageMangerList,
  getOnlineVersion
}


