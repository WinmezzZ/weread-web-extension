![](https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202404042311425.png)

## 介绍

这是一款针对微信读书网页版的浏览器插件, 主要功能如下
 - 自动阅读: 自动滚动网页, 速度可调
 - 设置页面宽度: 享受近乎全屏的阅读体验

## 安装方式

- Chrome: 审核中
- Firefox: 审核中
- Edge: 审核中

## 开发

### Chrome

执行`start:chrome`之后可以得到`/build/firefox-mv2-dev`的文件夹, 在 chrome 浏览器中打开 `chrome://extensions/`, 开启开发模式后, 将该文件夹丢入即可进行开发测试.

### Firefox

执行`start:firefox`之后可以得到`/build/chrome-mv3-dev`的文件夹, 在 firefox 浏览器中打开 `about:debugging#/runtime/this-firefox`, 点击`临时加载附加组件`选中`/build/chrome-mv3-dev`中的`manifest.json`即可.

## 打包上传

```json
{
  "build:firefox": "npx plasmo build --target=firefox-mv2",
  "build:chrome": "npx plasmo build --target=chrome-mv3"
}
```

### Chrome

执行`build:chrome`后将`chrome-mv3-prod`文件夹进行压缩, 然后上传到 chrome 浏览器的[扩展商店](https://chrome.google.com/webstore/devconsole)即可.

### Firefox

执行`build:firefox`后打开`firefox-mv2-prod`文件夹将其内容进行打包, 然后上传到 firefox 浏览器的[扩展商店](https://addons.mozilla.org/zh-CN/developers/addon/submit/theme/distribution)即可.

> 注意, 不是打包`firefox-mv2-prod`, 是打包里面的内容

### Edge

执行`build:edge`后将`edge-mv3-prod`文件夹进行压缩, 然后上传到 edge 浏览器的[扩展商店](https://partner.microsoft.com/zh-cn/dashboard/microsoftedge/overview)即可.