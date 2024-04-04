import { Storage } from '@plasmohq/storage';

import { defaultConfig, type Config } from '~types/config';

export const storage = new Storage();
/** 所有需要读配置的地方, 直接读这个对象, 并不直接从 Storage 中读 */
export let localConfig = defaultConfig;
let timer: NodeJS.Timeout;

storage.watch({
  config: (data) => {
    localConfig = data.newValue;
  }
});

// 初始化本地配置, 从 Storage 中读取只有这一次, 其余的时候直接读
(async () => {
  localConfig = await storage.get('config');
  if (!localConfig) {
    await storage.set('config', defaultConfig);
  } else {
    // 对齐本地配置与最新版版本
    const mergedConfig = Object.entries(defaultConfig).reduce(
      (acc, [key, value]) => {
        if (!(key in acc)) {
          acc[key] = value;
        }
        return acc;
      },
      { ...localConfig }
    );
    await storage.set('config', mergedConfig);
  }
})();

function saveConfig(config: Config): void {
  (async () => {
    await storage.set('config', config);
  })();
}
/** 获取配置, 但是只返回本地的, 并不重新从 Storage 中读取. 因为读取是异步的, 需要时间, 没必要 */
export function getConfig(): Config {
  return localConfig;
}

/** 从 Storage 中读取配置 */
export function getStorageConfig(): Promise<Config> {
  return storage.get('config');
}

export function updateConfig(config: Partial<Config>): void {
  clearTimeout(timer);
  localConfig = { ...localConfig, ...config };
  timer = setTimeout(() => {
    saveConfig(localConfig);
  }, 500);
}
