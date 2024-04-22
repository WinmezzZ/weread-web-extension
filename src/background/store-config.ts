import { create } from 'zustand';

import { Storage } from '@plasmohq/storage';

import { defaultConfig, type Config } from '~types/config';

const storage = new Storage();
let timer: NodeJS.Timeout;

// todo: 可以使用 combine 改写点优雅点
export const useWWEStore = create<{
  config: Config;
  updateConfig: (config: Partial<Config>) => void;
  loaded: boolean;
  updateLoaded: (status: boolean) => void;
}>((set, get) => {
  return {
    config: defaultConfig,
    updateConfig: (config: Partial<Config>) => {
      clearTimeout(timer);
      const currentConfig = get().config;
      const newConfig = { ...currentConfig, ...config };
      set({ config: newConfig });
      timer = setTimeout(() => {
        saveConfig(newConfig);
      }, 500);
    },
    loaded: false,
    updateLoaded: (status) => set({ loaded: status })
  };
});

/** 从 storage 中读取配置 */
export async function loadConfig(): Promise<Config> {
  return new Promise(async (resolve) => {
    const storedConfig = await storage.get<Config>('config');

    let resolvedConfig: Config;

    if (!storedConfig) {
      resolvedConfig = defaultConfig;
    } else {
      // 对齐本地配置与最新版本配置
      resolvedConfig = {
        ...defaultConfig,
        controlStatus: {
          ...defaultConfig.controlStatus,
          ...(storedConfig.controlStatus || {})
        }
      };
    }

    resolve(resolvedConfig);
  });
}

function saveConfig(config: Config): void {
  (async () => {
    await storage.set('config', config);
  })();
}
