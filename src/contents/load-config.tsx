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

  useEffect(() => {
    loadConfig().then((config) => {
      updateConfig(config);
      updateLoaded(true);
    });
  }, []);
  return <></>;
};

export default LoadConfigApp;
