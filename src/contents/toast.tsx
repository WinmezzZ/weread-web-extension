import { useState } from 'react';
import { Alert, Toast } from 'react-daisyui';

import { getConfig } from '~background/config';
import { myGetStyle, myPlasmoCSConfig } from '~core/plasmo-config';

export const config = myPlasmoCSConfig;
export const getStyle = myGetStyle;

let _setText: React.Dispatch<React.SetStateAction<string>>;
let _setStatus: React.Dispatch<React.SetStateAction<string>>;
let timer: NodeJS.Timeout;

/** 在页面上显示文本 */
export function toast(text: string, status = 'info'): void {
  const { muteMode } = getConfig();
  if (muteMode) {
    return;
  }
  clearTimeout(timer);
  const formattedText = text.replace(/\n/g, '<br/>');
  _setText(formattedText);
  _setStatus(status);
  timer = setTimeout(() => _setText(''), 3000);
}

const App = () => {
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

export default App;
