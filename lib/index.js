const path = require('path');
const fs = require('fs');
const {
  warn, assert, error, getRequestPath, getFileContent,
} = require('./utils');

class Mocker {
  constructor({ root, autoRefresh, lazy }) {
    if (typeof root !== 'string') {
      assert('string', typeof root);
    }
    if (!path.isAbsolute(root)) {
      assert('an absolute path', root);
    }
    this.root = root;
    this.lazy = lazy;
    this.autoRefresh = autoRefresh;
    if (this.autoRefresh && this.cache) {
      warn('autoRefresh mode will disable cache');
    }
    this._responseCache = {};
  }

  serveFile(filePath, app) {
    let suffix = getRequestPath(filePath, this.root);
    suffix = suffix.replace(path.extname(suffix), '');

    // 提前获取文件并缓存
    if (!this.lazy) {
      const file = getFileContent(filePath);
      this._responseCache[suffix] = file;
    }

    app.get(suffix, (req, res) => {
      let response = this.lazy ? getFileContent(filePath)
        : this._responseCache[suffix];

      if (!this._responseCache[suffix]) {
        this._responseCache[suffix] = response;
      }

      if (filePath.endsWith('.js')) {
        if (typeof response === 'function') {
          response = response.call(null, req, res);
        }
      }

      res.json(response);
    });
  }

  walkDir(dirName, app) {
    const self = this;
    fs.readdir(dirName, (e1, sub) => {
      sub.forEach((ele) => {
        const fullPathFile = path.resolve(dirName, ele);
        fs.stat(fullPathFile, (e2, info) => {
          if (info.isDirectory()) {
            self.walkDir(fullPathFile, app);
          } else {
            self.serveFile(fullPathFile, app);
          }
        });
      });
    });
  }

  apply(compiler) {
    const rootPath = this.root;

    // 在初始化配置文件中的插件之后立即调用
    compiler.hooks.environment.tap('SimpleMockPlugin', () => {
      const devServer = compiler.options.devServer || {};
      const beforeFn = devServer.before;

      if (this.autoRefresh) {
        devServer.hot = true;
        let { contentBase } = devServer;
        if (contentBase) {
          if (Array.isArray(contentBase)) {
            contentBase.push(rootPath);
          } else if (typeof contentBase === 'string') {
            contentBase = [contentBase, rootPath];
          }
        } else {
          contentBase = rootPath;
        }
        devServer.contentBase = contentBase;
        devServer.watchContentBase = true;
      }

      devServer.before = (app) => {
        try {
          this.walkDir(rootPath, app);
        } catch (e) {
          error(e);
        } finally {
          if (beforeFn) beforeFn();
        }
      };
    });
  }
}

module.exports = Mocker;
