import { Storage } from '@plasmohq/storage';

import { defaultConfig, type Config } from '~types/config';

const storage = new Storage();

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
        ...storedConfig,
        controlStatus: {
          ...defaultConfig.controlStatus,
          ...(storedConfig.controlStatus || {})
        }
      };
    }

    resolve(resolvedConfig);
  });
}

export function saveConfig(config: Config): void {
  (async () => {
    await storage.set('config', config);
  })();
}