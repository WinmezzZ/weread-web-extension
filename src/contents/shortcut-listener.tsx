import { useEffect } from 'react';

import { useWWEStore } from '~background/store-config';

import { beingReaderPage } from '~core/utils';

import { toast } from './toast';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const ShortcutListenerApp = () => {
  const updateConfig = useWWEStore((state) => state.updateConfig);

  let startAutoReading = false;
  let recordScroll: number;

  /** 记录当前滚轴高度, 开启自动阅读时是基于当前的滚轴高度进行变化的 */
  const recordScrollHeight = () => {
    recordScroll =
      document.documentElement.scrollTop || document.body.scrollTop;
  };

  const autoRead = () => {
    const { speed } = useWWEStore.getState().config;
    recordScroll += speed / 100;
    document.documentElement.scrollTop = recordScroll;
    if (startAutoReading) {
      window.requestAnimationFrame(autoRead);
    }
  };

  const adjustSpeed = (type: 'fast' | 'slow') => {
    const { speed } = useWWEStore.getState().config;
    const speedResult = type === 'fast' ? speed + 1 : speed - 1;
    if (speedResult < 1 || speedResult > 100) {
      toast('速度已达到极限值!', 'error');
      return;
    }
    updateConfig({ speed: speedResult });
    toast(`调整速度至:${speedResult}`);
  };

  const adjustProgress = (type: 'up' | 'down', e: KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    recordScrollHeight();
    recordScroll = type === 'up' ? recordScroll - 45 : recordScroll + 45;
    document.documentElement.scrollTop = recordScroll;
  };

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!beingReaderPage()) {
        return;
      }
      if (['x', 'X'].includes(key)) {
        // 开启/关闭自动阅读
        startAutoReading = !startAutoReading;
        if (startAutoReading) {
          toast('开启自动阅读');
          recordScrollHeight();
          window.requestAnimationFrame(autoRead);
        } else {
          toast('关闭自动阅读');
        }
      } else if (['a', 'A'].includes(key)) {
        adjustSpeed('slow');
      } else if (['d', 'D'].includes(key)) {
        adjustSpeed('fast');
      } else if (['ArrowUp', 'w', 'W'].includes(key)) {
        adjustProgress('up', e);
      } else if (['ArrowDown', 's', 'S'].includes(key)) {
        adjustProgress('down', e);
      }
    });

    window.addEventListener('load', () => {
      // #region 不支持就提示换浏览器, 不做兼容方案
      if (!window.requestAnimationFrame) {
        toast('该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!');
        return;
      }
      // #endregion
      if (beingReaderPage()) {
        const bookTitle = document.querySelector('.readerTopBar_title_link');
        if (bookTitle) {
          toast(
            `正在阅读: <<${bookTitle.textContent}>>\n按 x 开启沉浸式阅读!`,
            'success'
          );
        }
        // #region 自动滚动本质上是修改滚轴高度, 当翻页时, 需要重置滚轴高度. 这里判断翻页的方法是判断章节DOM内容是否变化
        const chapterTitle = document.querySelector(
          '.readerTopBar_title_chapter'
        );
        if (chapterTitle) {
          const documentObserver = new MutationObserver(function () {
            document.documentElement.scrollTop = 0;
            recordScrollHeight();
          });
          documentObserver.observe(chapterTitle, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        } else {
          toast('章节标题容器DOM已更换类名无法查找, 请联系作者修改代码!');
        }
        // #endregion
      }
    });
  }, []);
  return <></>;
};

export default ShortcutListenerApp;
