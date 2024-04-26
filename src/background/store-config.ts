import { create } from 'zustand';
import { defaultConfig, type Config } from '~types/config';
import { saveConfig } from './config';

let timer: NodeJS.Timeout;

interface State {
  config: Config;
  updateConfig: (config: Partial<Config>) => void;
  loaded: boolean;
  // 默认是普通阅读器, 微信读书新推出了个双栏阅读器 horizontal
  readerMode: 'horizontal' | 'normal';
}

// todo: 可以使用 combine 改写的优雅点
export const useWWEStore = create<State>((set, get) => {
  return {
  config: defaultConfig,
  loaded: false,
  readerMode: 'normal',
    updateConfig: (config: Partial<Config>) => {
      clearTimeout(timer);
      const currentConfig = get().config;
      const newConfig = { ...currentConfig, ...config };
      set({ config: newConfig });
      timer = setTimeout(() => {
        saveConfig(newConfig);
      }, 500);
    },
  };
});

