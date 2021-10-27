# Test-Mock-Webpack-Plugin

这个插件提供了一个简单的方式，只需要一点配置，你就可以在基于`webpack`和`webpack-dev-server`的项目中轻松的mock数据。

> 插件当前只支持`GET`请求的数据mock.

## 使用

[例子](./examples/base/README.md)

在webpack的配置文件中，加入插件:

```js
const TestMockMockPlugin = require('./lib/index.js')
const path = require('path')

module.exports = {
  // ...
  plugins: [
    // ...
    new TestMockMockPlugin({
      root: path.resolve(__dirname, 'mock'),
      lazy: true,
      autoRefresh: true
    })
  ]
}
```
具体参考`examples`里的案例

### 配置

- **root**

  `String`

  mock文件夹的路径，**必须是一个绝对路径**

- **lazy**

  `Boolean`

  如果设置成true的话，文件将会在接收到对应请求时被加载，在这种情况下，请求处理时间可能会稍微长一点，但是项目启动的时间相对设置成false时短了。
  
  如果设置成false的话，项目会在启动的时候就加载好所有的mock文件放入缓存中，所以项目启动时间会有所增加，但是请求的响应速度会加快。
  
- **autoRefresh**

  `Boolean`

  设置成true的话，只要你修改了mock文件夹下的文件，浏览器都会自动刷新以获取最新的数据。设置成false的话，你只能手动刷新来打到目的。

  > 注意：这个配置只有在`lazy`设置成true的时候起作用。如果`lazy`为`false`的话，那么优先会加载缓存，你需要重启项目才能获得更新后的mock数据。
