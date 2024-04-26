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

  useEffect(() => {
    // 因为初始化的配置是在 load 之后, 所以其他 cs 脚本一定也是在 load 之后, 无需重复监听
    window.addEventListener('load', () => {
      // 判断当前的阅读模式
      const isHorizontalReader = $('.isHorizontalReader').length > 0

      useWWEStore.setState({  readerMode: isHorizontalReader ? 'horizontal' : 'normal' });
      // 加载配置初始化
      loadConfig()
        .then((config) => {
          updateConfig(config);
        })
        .finally(() => {
          useWWEStore.setState({ loaded: true });
        });
    });
  }, []);
  return <></>;
};

export default LoadConfigApp;
