import $ from 'jquery';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Badge, Kbd, Modal, Toggle, Tooltip } from 'react-daisyui';

import { getConfig, updateConfig } from '~background/config';
import { myGetStyle, myPlasmoCSConfig } from '~core/plasmo-config';
import { beingReaderPage } from '~core/utils';

import { toast } from './toast';

export const config = myPlasmoCSConfig;
export const getStyle = myGetStyle;
const widthList = [1000, 1200, 1400, 1600, 2000];
const base64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAJ1BMVEX7jgryXw0AAAD9rA/90i/9zgX8ww//5jP8wCD6yW389Nr//bHziRSKzlbJAAAADXRSTlP+/wD//vzGCDj//wJ9gk4UkwAAAnpJREFUeJxtlD1v2zAQho+QPXgjYXvoyiEU4AwSaDkf6OBA9NBNgUI59RQksOeCgKd2CFQYKJAMBjIlq5EhHr3Uo7f2Z/VIyh8JyoGC3kcvT+TdEbgbv7l4nNz1Jr8M/+4VcLPg64mWdhQP3OxBx6zHTn95SooHsdoBE451RAIEi0QXpdgCIVAHgEB2B1oPCmMqYGb6qg/AIED9Sg2uhQcixDdF4RlASoVDl8YBNCiV0k/L+fmT1b0FrCFXqg+NJZwvUrW1AF9NZaCUDQ6NVHrLsIPAjGlLpVaXsuuDqEJwEGFGQXkdZe9JSgOraUyo1XEbsquUm5JhB8yMURfAWSzAKS8EiIzVU9hZ3Hpf5tpAeMlecthZcERq9JaUcBTTZQY7iwW10aJ+C9Os/XwJh5YoUFl9CLO8dRUF0oPIAnRC+xrGeVch8KTxhAZ8kmaBQClc3P9xY+4BsyBD4F+B2igAtQsLNAJaLeBPwAENOnbA6ow5QloxowgYAh/BAcQ40JFRm9YKEHAyIwhu2Bb4bytQ/BdQ0i7gDgH5AJqkXsBP1lWxj3AAkmuYspq6eK+zOkuGcERaqv9epznVtxDGTTyTQx2CqKlLEBH7ABIZ1xMDZoPR+wd7aOLByc8CVt+Irbc9wFQF8qQD4hjwUPabaLr0YsHx8obU8L8qQmWCek/Yor4HOnqrNo4J+IrpPem4NiCkhhUURK5KuqNXu5JtnHLDIFFVUWEZpvLUNQ4Pj11Ot2CQy6rVeHlPXLGdLVPXCKdVc/Iw3FjD2fNybou6t2tnXh77Ll/6PYj9lVH+cGu5MH8Orgwe8vXGB++9u2TstRQ+TqSc/N1dS/8AQHHIPEqwpd4AAAAASUVORK5CYII=';

const App = () => {
  const [width, setWidth] = useState(null);
  const [muteMode, setMuteMode] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const showModal = useCallback(() => {
    if (!beingReaderPage()) {
      toast('请在阅读页面使用!', 'error');
      return;
    }
    ref.current?.showModal();
  }, [ref]);

  useEffect(() => {
    const { pageWidth, muteMode } = getConfig();
    setMuteMode(muteMode);
    if (beingReaderPage()) {
      setPageWidth(pageWidth);
    }
  }, []);

  /** 设置可阅读范围的宽度 */
  const setPageWidth = (value: number) => {
    if (width === value) {
      return;
    }
    setWidth(value);
    updateConfig({ pageWidth: value });
    $('.app_content').css('max-width', `${value}px`),
      $('.readerTopBar').css('max-width', `${value}px`),
      $('.readerControls').css('margin-left', value / 2 + 48 + 'px'),
      setTimeout(() => window.dispatchEvent(new Event('resize')));
  };

  const toggleMuteMode = (value: boolean) => {
    if (value) {
      toast('');
    }
    updateConfig({ muteMode: value });
    setMuteMode(value);
  };

  const renderDom = () => {
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${base64})`,
            opacity: muteMode ? 0 : 1
          }}
          className="bg-cover bg-center fixed w-12 h-12 left-4 top-3 cursor-pointer brightness-50 hover:brightness-100"
          onClick={showModal}></div>
        <div className="font-sans">
          <Modal ref={ref} backdrop={true}>
            <Modal.Header className="font-bold">设置</Modal.Header>
            <Modal.Body>
              <form className="flex flex-col">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    页面宽度:
                  </label>

                  <div className="flex flex-auto gap-2">
                    {widthList.map((item) => (
                      <Badge
                        key={item}
                        className="cursor-pointer"
                        outline={true}
                        color={width === item ? 'accent' : 'neutral'}
                        onClick={() => setPageWidth(item)}>
                        {item}px
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-gray-700 font-medium mb-1 flex items-center">
                    <Tooltip
                      message="该模式下, 插件的提醒、icon都会隐藏避免打扰, 但icon依旧可以点击"
                      position="right">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </Tooltip>
                    <span>寂静模式:</span>
                  </label>
                  <div className="font-sans flex flex-col gap-1">
                    <Toggle
                      checked={muteMode}
                      onChange={(e) => toggleMuteMode(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    快捷键:
                  </label>
                  <div className="font-sans flex flex-col gap-1">
                    <div>
                      <Kbd>X</Kbd>: 开始/停止自动阅读
                    </div>
                    <div>
                      <Kbd>W</Kbd>
                      <Kbd>S</Kbd>: 上下滚动一下
                    </div>
                    <div>
                      <Kbd>A</Kbd>
                      <Kbd>D</Kbd>: 调整阅读速度
                    </div>
                    <div>
                      <Kbd>◀︎</Kbd>
                      <Kbd>▶︎</Kbd>: 切换章节
                    </div>
                  </div>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  };
  return <>{renderDom()}</>;
};

export default App;
