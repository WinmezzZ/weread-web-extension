import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect } from 'react';

import { loadConfig, useWWEStore } from '~background/store-config';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const LoadConfigApp = () => {
  const updateConfig = useWWEStore((state) => state.updateConfig);
  const updateLoaded = useWWEStore((state) => state.updateLoaded);
  const updateReaderMode = useWWEStore((state) => state.updateReaderMode);

  useEffect(() => {
    // 因为初始化的配置是在 load 之后, 所以其他 cs 脚本一定也是在 load 之后, 无需重复监听
    window.addEventListener('load', () => {
      // 判断当前的阅读模式
      if ($('.isHorizontalReader').length > 0) {
        updateReaderMode('horizontal');
      } else {
        updateReaderMode('normal');
      }
      // 加载配置初始化
      loadConfig()
        .then((config) => {
          updateConfig(config);
        })
        .finally(() => {
          updateLoaded(true);
        });
    });
  }, []);
  return <></>;
};

export default LoadConfigApp;
