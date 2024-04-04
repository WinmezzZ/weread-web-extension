import cssText from 'data-text:./style.css';
import type { PlasmoCSConfig } from 'plasmo';

/**
 * 定义 cs 匹配的域名和执行时机
 */
export const myPlasmoCSConfig: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

/**
 * 使用 tailwind 时必须导入这个函数, 详见 https://docs.plasmo.com/quickstarts/with-tailwindcss#in-content-scripts-ui
 * @returns
 */
export const myGetStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText.replaceAll(':root', ':host(plasmo-csui)');
  return style;
};
