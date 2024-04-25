import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect } from 'react';

import { useWWEStore } from '~background/store-config';
import { beingReaderPage } from '~core/utils';

import { toast } from './toast';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const ShortcutListenerApp = () => {
  const updateConfig = useWWEStore((state) => state.updateConfig);
  const loaded = useWWEStore((state) => state.loaded);
  const readerMode = useWWEStore((state) => state.readerMode);

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

  /** 调整阅读进度 */
  const adjustProgress = (type: 'up' | 'down', e: KeyboardEvent) => {
    // 微信读书本身也实现了上下箭头的事件, 阻止他的事件, 自己实现相关业务
    e.preventDefault();
    e.stopPropagation();
    recordScrollHeight();
    recordScroll = type === 'up' ? recordScroll - 45 : recordScroll + 45;
    document.documentElement.scrollTop = recordScroll;
  };

  /** 仅适用于双栏模式下的翻页 */
  const ajustSection = (type: 'previous' | 'next') => {
    const $pageChangeBtn = $('.renderTarget_pager_button');
    let $targetBtn: JQuery<HTMLElement>;
    if (type === 'previous') {
      $targetBtn = $pageChangeBtn.eq(0);
    } else if(type === 'next') {
      $targetBtn = $pageChangeBtn.eq(1);
    }
    $targetBtn.trigger('click');
  };

  useEffect(() => {
    if (!loaded) {
      return;
    }
    window.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!beingReaderPage()) {
        return;
      }
      if (['x', 'X'].includes(key)) {
        if (readerMode === 'horizontal') {
          toast('当前阅读模式为双栏模式, 不支持自动阅读', 'error');
          return;
        }
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
        if (readerMode === 'horizontal') {
          ajustSection('previous');
        } else if(readerMode === 'normal') {
          adjustSpeed('slow');
        }
      } else if (['d', 'D'].includes(key)) {
        if (readerMode === 'horizontal') {
          ajustSection('next');
        } else if(readerMode === 'normal') {
          adjustSpeed('fast');
        }
      } else if (['ArrowUp', 'w', 'W'].includes(key)) {
        if (readerMode === 'horizontal') {
          ajustSection('previous');
        } else if(readerMode === 'normal') {
          adjustProgress('up', e);
        }
      } else if (['ArrowDown', 's', 'S'].includes(key)) {
        if (readerMode === 'horizontal') {
          ajustSection('next');
        } else if(readerMode === 'normal') {
          adjustProgress('down', e);
        }
      }
    });

    if (beingReaderPage()) {
      if (readerMode === 'normal') {
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
      } else if (readerMode === 'horizontal') {
        toast('当前阅读模式为双栏模式, 不支持自动阅读');
      }
      // #endregion
    }
  }, [loaded]);
  return <></>;
};

export default ShortcutListenerApp;
