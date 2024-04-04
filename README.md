## 介绍

这是一款浏览器插件, Satellite 本意为卫星, 是因为这款插件只服务于我一个人. 类似于月球围绕地球转的概念. 我日常可能需要到的浏览器插件功能都会往上面堆.

## 微信读书

### 自动阅读

![](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202403311827729.gif)

我喜欢用微信读书网页端看书, 但是网页端和移动端有许多不同. 对我而言最大的痛点是网页端没有自动阅读. 开始你的沉浸式阅读吧!

- 按下x, 开启自动阅读
- 按下w/s, 往上/往下滚动
- 按下a/d, 降低/加快阅读速度

### 安装方式

- Firefox: https://addons.mozilla.org/zh-CN/firefox/addon/satellite/
- Chrome: 审核中

### 开发

#### Firefox

执行`start:firefox`之后可以得到`/build/chrome-mv3-dev`的文件夹, 在 firefox 浏览器中打开 `about:debugging#/runtime/this-firefox`, 点击`临时加载附加组件`选中`/build/chrome-mv3-dev`中的`manifest.json`即可.

#### Chrome

执行`start:chrome`之后可以得到`/build/firefox-mv2-dev`的文件夹, 在 chrome 浏览器中打开 `chrome://extensions/`, 开启开发模式后, 将该文件夹丢入即可进行开发测试.

### 打包上传

```json
{
  "build:firefox": "npx plasmo build --target=firefox-mv2",
  "build:chrome": "npx plasmo build --target=chrome-mv3"
}
```

#### Firefox

执行`build:firefox`后打开`firefox-mv2-prod`文件夹将其内容进行打包, 注意, 不是打包`firefox-mv2-prod`, 是打包里面的内容, 然后上传到 firefox 浏览器的扩展商店即可.

#### Chrome

执行`build:chrome`后将`chrome-mv3-prod`文件夹进行压缩, 然后上传到 chrome 浏览器的扩展商店即可.

#### 其他浏览器

目前我只使用这两款浏览器, 其他的浏览器只支持本地开发或者你自行上传也可以.
