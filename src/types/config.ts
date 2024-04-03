export interface Config {
  /** 自动阅读的速度 */
  speed: number;
  /** 屏幕通知的停留时间 */
  notifyTime: number;
}

export const defaultConfig = {
  speed: 20,
  notifyTime: 2000,
};
