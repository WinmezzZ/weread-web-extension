import $ from 'jquery';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Checkbox,
  Divider,
  Form,
  Kbd,
  Modal,
  Toggle,
  Tooltip
} from 'react-daisyui';

import { getConfig, updateConfig } from '~background/config';
import { myGetStyle, myPlasmoCSConfig } from '~core/plasmo-config';
import { beingReaderPage } from '~core/utils';
import { logoBase64 } from '~types/config';

import { toast } from './toast';

export const config = myPlasmoCSConfig;
export const getStyle = myGetStyle;
const widthList = [1000, 1200, 1400, 1600, 2000];
const controlList = [
  {
    title: '听书',
    key: 'listen',
    selector: '.readerControls_item.lecture'
  },
  {
    title: '目录',
    key: 'menu',
    selector: '.readerControls_item.catalog'
  },
  {
    title: '笔记',
    key: 'note',
    selector: '.readerControls_item.note'
  },
  {
    title: '字号',
    key: 'fontSize',
    selector: '.readerControls_fontSize'
  },
  {
    title: '主题',
    key: 'theme',
    selector: '.readerControls_item.dark,.readerControls_item.white'
  },
  {
    title: 'App',
    key: 'app',
    selector: '.readerControls_item.download'
  }
];

const App = () => {
  const [width, setWidth] = useState(null);
  const [muteMode, setMuteMode] = useState(false);
  const [controlStatus, setControlStatus] = useState({
    listen: false,
    menu: true,
    note: false,
    fontSize: false,
    theme: false,
    app: false
  });
  const ref = useRef<HTMLDialogElement>(null);
  const showModal = useCallback(() => {
    if (!beingReaderPage()) {
      toast('请在阅读页面使用!', 'error');
      return;
    }
    ref.current?.showModal();
  }, [ref]);

  useEffect(() => {
    const { pageWidth, muteMode, controlStatus } = getConfig();
    setMuteMode(muteMode);
    if (beingReaderPage()) {
      setPageWidth(pageWidth);
      setControlStatus(controlStatus);
      // 控件状态初始化
      controlList.forEach((v) => {
        $(v.selector).css('display', controlStatus[v.key] ? 'flex' : 'none');
      });
    }
  }, []);

  /** 设置可阅读范围的宽度 */
  const setPageWidth = (value: number) => {
    if (width === value) {
      return;
    }
    setWidth(value);
    updateConfig({ pageWidth: value });
    $('.app_content').css('max-width', `${value}px`);
    $('.readerTopBar').css('max-width', `${value}px`);
    setTimeout(() => window.dispatchEvent(new Event('resize')));
  };

  const toggleMuteMode = (value: boolean) => {
    if (value) {
      toast('');
    }
    updateConfig({ muteMode: value });
    setMuteMode(value);
  };

  const toggleControlStatus = (
    status: boolean,
    item: (typeof controlList)[number]
  ) => {
    const { key, selector } = item;
    const updatedControlStatus = { ...controlStatus };
    updatedControlStatus[key] = status;
    $(selector).css('display', updatedControlStatus[key] ? 'flex' : 'none');
    setControlStatus(updatedControlStatus);
    updateConfig({ controlStatus: updatedControlStatus });
  };

  const renderDom = () => {
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${logoBase64})`,
            opacity: muteMode ? 0 : 1
          }}
          className="bg-cover bg-center fixed w-12 h-12 left-4 top-3 cursor-pointer brightness-50 hover:brightness-100"
          onClick={showModal}></div>
        <div className="font-sans">
          <Modal ref={ref} backdrop={true}>
            <Modal.Body>
              <form className="flex flex-col">
                <Divider>插件设置</Divider>
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
                    <span>勿扰模式:</span>
                  </label>
                  <div className="font-sans flex flex-col gap-1">
                    <Toggle
                      checked={muteMode}
                      onChange={(e) => toggleMuteMode(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-gray-700 font-medium mb-1 flex items-center">
                    <span>显示控件:</span>
                  </label>
                  <div className=" flex flex-wrap font-sans gap-1">
                    {controlList.map((item) => (
                      <Form.Label
                        title={item.title}
                        key={item.key}
                        className="w-16">
                        <Checkbox
                          checked={controlStatus[item.key]}
                          onChange={(e) =>
                            toggleControlStatus(e.target.checked, item)
                          }
                        />
                      </Form.Label>
                    ))}
                  </div>
                </div>
                <Divider>快捷键说明</Divider>
                <div className="mb-4">
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
