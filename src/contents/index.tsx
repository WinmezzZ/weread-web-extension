import type { PlasmoCSConfig } from 'plasmo';
import { useState } from 'react';
import { localConfig } from '~background/config';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start',
};

let _setText: React.Dispatch<React.SetStateAction<string>>;
let timer: NodeJS.Timeout;

/** 在页面上显示文本 */
export function notify(text: string): void {
  clearTimeout(timer);
  const formattedText = text.replace(/\n/g, '<br/>');
  _setText(formattedText);
  timer = setTimeout(() => _setText(''), localConfig.notifyTime);
}

const App = () => {
  const [text, setText] = useState('');
  _setText = setText;

  const renderDom = () => {
    if (text) {
      return (
        <div
          style={{
            padding: '10px',
            left: '0',
            top: '0',
            color: '#fff',
            fontSize: '30px',
            position: 'fixed',
            textShadow: '1px 1px black',
          }}
        >
          <span>Satellite:</span>
          <br />
          <div dangerouslySetInnerHTML={{__html: text}}></div>
        </div>
      );
    } else {
      return null;
    }
  };

  return <>{renderDom()}</>;
};

export default App;
