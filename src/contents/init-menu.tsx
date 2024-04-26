import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect } from 'react';

import { useWWEStore } from '~background/store-config';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const MenuApp = () => {
  const { loaded, readerMode } = useWWEStore((state) => state);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    // #region 将菜单栏放在头像右侧
    const $header = $('.readerTopBar_right');
    const $menuContainer = $('.readerControls');
    $menuContainer.css({
      marginLeft: '0px',
      display: 'flex',
      flexDirection: 'row',
      position: 'unset',
      width: 'fit-content',
      alignItems: 'center',
      transform: 'translateY(0px)'
    });
    // 设置字号的菜单类名和其他菜单不一样, 但前缀是一样的, 都是 readerControls_ 开头
    const $menuItem = $('[class^="readerControls_"]');
    $menuItem.css('margin-top', '0px');
    if(readerMode === 'horizontal') {
      $menuItem.css('background-color', 'unset');
    }
    $menuContainer.remove();
    $menuContainer.insertAfter($header);
    // #endregion
  }, [loaded]);
  return <></>;
};

export default MenuApp;
