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
      // updateConfig(config);
      const currentConfig = get().config;
      const newConfig = { ...currentConfig, ...config };
      set({ config: newConfig });
    },
    loaded: false,
    updateLoaded: (status) => set({ loaded: status })
  };
});

/** 从 storage 中读取配置 */
export async function loadConfig(): Promise<Config> {
  return new Promise(async (resolve) => {
    const config = await storage.get<Config>('config');
    if (!config) {
      resolve(config);
    } else {
      // 对齐本地配置与最新版版本
      const mergedConfig = Object.entries(defaultConfig).reduce(
        (acc, [key, value]) => {
          if (!(key in acc)) {
            acc[key] = value;
          }
          return acc;
        },
        { ...config }
      );
      resolve(mergedConfig);
    }
  });
}

function saveConfig(config: Config): void {
  (async () => {
    await storage.set('config', config);
  })();
}

/** zustand 的更新函数中不能处理副作用, 先临时写在外部 */
export function updateConfigTemp(config: Partial<Config>): void {
  clearTimeout(timer);
  const currentConfig = useWWEStore.getState().config;
  const newConfig = { ...currentConfig, ...config };
  const { setState } = useWWEStore;
  setState({ config: newConfig });
  timer = setTimeout(() => {
    saveConfig(newConfig);
  }, 500);
}
