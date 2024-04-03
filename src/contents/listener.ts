import type { PlasmoCSConfig } from 'plasmo';
import { getConfig, updateConfig, localConfig } from '~background/config';
import { notify } from '~contents';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start',
};

let startAutoReading = false;
let recordScroll: number;

/** 记录当前滚轴高度, 开启自动阅读时是基于当前的滚轴高度进行变化的 */
function recordScrollHeight() {
  recordScroll = document.documentElement.scrollTop || document.body.scrollTop;
}

function addScrollTop(): void {
  recordScroll += localConfig.speed / 100;
  document.documentElement.scrollTop = recordScroll;
  if (startAutoReading) {
    window.requestAnimationFrame(addScrollTop);
  }
}

window.addEventListener('keydown', (e) => {
  const key = e.key;
  if (['x', 'X'].includes(key)) {
    // 开启/关闭自动阅读
    startAutoReading = !startAutoReading;
    if (startAutoReading) {
      notify('开启自动阅读');
      recordScrollHeight();
      window.requestAnimationFrame(addScrollTop);
    } else {
      notify('关闭自动阅读');
    }
  } else if (['a', 'A'].includes(key)) {
    const { speed } = getConfig();
    if (speed > 1) {
      const speedResult = speed - 1;
      updateConfig({ speed: speedResult });
      notify(`减小速度为:${speedResult}`);
    } else {
      notify(`最小速度为1`);
    }
  } else if (['d', 'D'].includes(key)) {
    const { speed } = getConfig();
    if (speed < 100) {
      const speedResult = speed + 1;
      updateConfig({ speed: speedResult });
      notify(`增大速度为:${speedResult}`);
    } else {
      notify(`最大速度为100`);
    }
  } else if (['ArrowUp', 'w', 'W'].includes(key)) {
    recordScrollHeight();
    recordScroll -= 45;
    document.documentElement.scrollTop = recordScroll;
  } else if (['ArrowDown', 's', 'S'].includes(key)) {
    recordScrollHeight();
    recordScroll += 45;
    document.documentElement.scrollTop = recordScroll;
  }
});

window.addEventListener('load', () => {
  // #region 不支持就提示换浏览器, 不做兼容方案
  if (!window.requestAnimationFrame) {
    notify('该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!');
    return;
  }
  // #endregion

  const pathname = window.location.pathname;
  if (!pathname.includes('/web/reader/')) {
    notify(`未检测到书籍, 请在阅读页面使用!`);
    return;
  }
  const bookTitle = document.querySelector('.readerTopBar_title_link');
  if (bookTitle) {
    notify(`正在阅读: ${bookTitle.textContent}\n按 x 进入沉浸式阅读`);
  }
  // #region 自动滚动本质上是修改滚轴高度, 当翻页时, 需要重置滚轴高度. 这里判断翻页的方法是判断章节DOM内容是否变化
  const chapterTitle = document.querySelector('.readerTopBar_title_chapter');
  if (chapterTitle) {
    const documentObserver = new MutationObserver(function () {
      document.documentElement.scrollTop = 0;
      recordScrollHeight();
    });
    documentObserver.observe(chapterTitle, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  } else {
    notify('章节标题容器DOM已更换类名无法查找, 请联系作者修改代码!');
  }
  // #endregion
});
