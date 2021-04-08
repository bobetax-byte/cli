/**
 * @description 自动化创建创建组件
*/
const { ifPathExit, log } = require('./utils')
const path = require('path');


module.exports = async (componentName) => {
  // 首先获取文件夹
  const defaultPath = path.join(process.cwd() + '/src/components')
  if (ifPathExit(componentName, defaultPath)) {
    log('当前存在同名组件，请检查之后在重试！')
    return
  } else {
    // 创建对应的组件
    
  }
}