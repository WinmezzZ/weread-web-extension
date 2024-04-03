import { Storage } from '@plasmohq/storage';
import { Subject, debounceTime } from 'rxjs';
import { defaultConfig, type Config } from '~types/config';

const updateConfig$ = new Subject<Config>();
export const storage = new Storage();
/** 所有需要读配置的地方, 直接读这个对象, 并不直接从 Storage 中读 */
export let localConfig = defaultConfig;

storage.watch({
  config: (data) => {
    localConfig = data.newValue;
  },
});

// 初始化本地配置, 从 Storage 中读取只有这一次, 其余的时候直接读
(async () => {
  localConfig = await storage.get('config');
  if (!localConfig) {
    await storage.set('config', defaultConfig);
  }
})();

// 防抖更新本地配置, 否则更新频率太高会报错, https://stackoverflow.com/questions/66092333/chrome-extension-max-write-operations-per-minute-error
updateConfig$.pipe(debounceTime(500)).subscribe((config: Config) => {
  (async () => {
    await storage.set('config', config);
  })();
});

/** 获取配置, 但是只返回本地的, 并不重新从 Storage 中读取. 因为读取是异步的, 需要时间, 没必要 */
export function getConfig(): Config {
  return localConfig;
}

/** 从 Storage 中读取配置 */
export function getStorageConfig(): Promise<Config> {
  return storage.get('config');
}

export function updateConfig(config: Partial<Config>): void {
  localConfig = { ...localConfig, ...config };
  updateConfig$.next(localConfig);
}
