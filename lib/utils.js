/* eslint-disable no-console */
require('colors');

const prefix = '[test-mock-webpack-plugin]';
function assert(expect, actual) {
  const message = `${prefix}:ERR: root field must be ${expect}, but got: 【${actual}】instead`;
  console.log(message.red);
  throw new Error(message);
}

function error(e) {
  let message = e || '';
  if (e instanceof Error) {
    message = e.message;
  }
  console.log(message.red);
}

function warn(message) {
  console.log(`${prefix}:WARN: ${message}`.yellow);
}

function getRequestPath(parent, child) {
  if (parent.includes(child)) {
    return parent.replace(child, '');
  }
  // fallback to child full path
  warn(`path ${child} is not part of ${parent}, will serve ${child} as a fallback, please 
    ensure the file you want to serve is under ${parent} dir`);
  return child;
}

function getFileContent(filePath) {
  // 删除node的require的缓存
  // 否则，文件的最新更新将不起作用，除非你重启应用程序
  delete require.cache[require.resolve(filePath)];
  // eslint-disable-next-line
  const response = require(filePath);
  return response;
}

module.exports = {
  warn,
  assert,
  error,
  getRequestPath,
  getFileContent,
};
