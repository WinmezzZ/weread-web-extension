/** 检测页面是否处于读书页面 */
export function beingReaderPage(): boolean {
  const pathname = window.location.pathname;
  return pathname.includes('/web/reader/');
}