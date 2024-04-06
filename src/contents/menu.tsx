import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect } from 'react';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const MenuApp = () => {
  useEffect(() => {
    window.addEventListener('load', () => {
      // #region 将菜单栏放在头像右侧
      const header = $('.readerTopBar_right');
      const menu = $('.readerControls');
      menu.css({
        marginLeft: '0px',
        display: 'flex',
        flexDirection: 'row',
        position: 'unset',
        width: 'fit-content',
        alignItems: 'center'
      });
      $('.readerControls_item').css('margin-top', '0px');
      $('.readerControls_fontSize').css('margin-top', '0px');
      menu.remove();
      menu.insertAfter(header);
      // #endregion
    });
  }, []);
  return <></>;
};

export default MenuApp;
