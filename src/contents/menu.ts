import $ from 'jquery';

import { myPlasmoCSConfig } from '~core/plasmo-config';

export const config = myPlasmoCSConfig;

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
