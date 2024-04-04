export interface Config {
  /** 自动阅读的速度 */
  speed: number;
  pageWidth: number;
  /** 寂静模式 */
  muteMode: boolean;
}

export const defaultConfig: Config = {
  speed: 20,
  pageWidth: 1000,
  muteMode: false,
};
