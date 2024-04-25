export interface Config {
  /** 自动阅读的速度 */
  speed: number;
  pageWidthPercent: number;
  /** 勿扰模式 */
  muteMode: boolean;
  controlStatus: {
    listen: boolean;
    menu: boolean;
    note: boolean;
    fontSize: boolean;
    theme: boolean;
    app: boolean;
    readerModeToggle: false;
  };
}

export const defaultConfig: Config = {
  speed: 20,
  muteMode: false,
  pageWidthPercent: 60,
  controlStatus: {
    listen: false,
    menu: true,
    note: false,
    fontSize: false,
    theme: false,
    app: false,
    readerModeToggle: false
  }
};
