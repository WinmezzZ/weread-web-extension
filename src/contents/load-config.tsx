import type { PlasmoCSConfig } from 'plasmo';
import { useEffect } from 'react';

import { loadConfig, updateConfigTemp, useWWEStore } from '~background/store-config';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

const LoadConfigApp = () => {
  const updateConfig = updateConfigTemp;
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
