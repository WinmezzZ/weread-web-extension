import type { PlasmoCSConfig } from 'plasmo';
import { useState } from 'react';
import { Alert, Toast } from 'react-daisyui';
import { useWWEStore } from '~background/store-config';

import { myGetStyle } from '~core/plasmo-config';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};
export const getStyle = myGetStyle;

let _setText: React.Dispatch<React.SetStateAction<string>>;
let _setStatus: React.Dispatch<React.SetStateAction<string>>;
let timer: NodeJS.Timeout;

/** 在页面上显示文本 */
export function toast(text: string, status = 'info'): void {
  const config = useWWEStore.getState().config;
  if (config.muteMode) {
    return;
  }
  clearTimeout(timer);
  const formattedText = text.replace(/\n/g, '<br/>');
  _setText(formattedText);
  _setStatus(status);
  timer = setTimeout(() => _setText(''), 3000);
}

const ToastApp = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<any>('info');
  _setText = setText;
  _setStatus = setStatus;

  const renderDom = () => {
    if (text) {
      return (
        <Toast>
          <Alert status={status}>
            <div dangerouslySetInnerHTML={{ __html: text }}></div>
          </Alert>
        </Toast>
      );
    } else {
      return null;
    }
  };

  return <>{renderDom()}</>;
};

export default ToastApp;
