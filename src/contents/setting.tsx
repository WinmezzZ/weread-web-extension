import $ from 'jquery';
import type { PlasmoCSConfig } from 'plasmo';
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

import { useWWEStore } from '~background/store-config';
import { myGetStyle } from '~core/plasmo-config';
import { beingReaderPage } from '~core/utils';
import { logoBase64 } from '~types/config';

import { toast } from './toast';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_end'
};
export const getStyle = myGetStyle;
const widthList = [1000, 1200, 1400, 1600, 2000];

const SettingApp = () => {
  const config = useWWEStore((state) => state.config);
  const loaded = useWWEStore((state) => state.loaded);
  const updateConfig = useWWEStore((state) => state.updateConfig);

  const [controlList, setControlList] = useState([]);

  const ref = useRef<HTMLDialogElement>(null);
  const showModal = useCallback(() => {
    if (!beingReaderPage()) {
      toast('请在阅读页面使用!', 'error');
      return;
    }
    ref.current?.showModal();
  }, [ref]);

  useEffect(() => {
    if (beingReaderPage()) {
      applyPageWidth(config.pageWidth);
      // #region 并不是所有的书籍的控件都是一模一样的, 需要遍历DOM确定
      const allControlList = [
        {
          title: '双栏',
          key: 'isNormalReader',
          selector: '.readerControls_item.isNormalReader'
        },
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
      const tempControlList = [];
      allControlList.forEach((v) => {
        const target = $(v.selector);
        if (target.length) {
          tempControlList.push(v);
        }
      });
      setControlList(tempControlList);
      // #endregion
      // 控件状态初始化
      tempControlList.forEach((v) => {
        $(v.selector).css(
          'display',
          config.controlStatus[v.key] ? 'flex' : 'none'
        );
      });
    }
  }, [loaded]);

  const setPageWidth = (value: number) => {
    if (config.pageWidth === value) {
      return;
    }
    updateConfig({ pageWidth: value });
    applyPageWidth(value);
  };

  const applyPageWidth = (value: number) => {
    $('.app_content').css('max-width', `${value}px`);
    $('.readerTopBar').css('max-width', `${value}px`);
    setTimeout(() => window.dispatchEvent(new Event('resize')));
  };

  const toggleMuteMode = (value: boolean) => {
    if (value) {
      toast('');
    }
    updateConfig({ muteMode: value });
  };

  const toggleControlStatus = (
    status: boolean,
    item: (typeof controlList)[number]
  ) => {
    const { key, selector } = item;
    const updatedControlStatus = { ...config.controlStatus };
    updatedControlStatus[key] = status;
    $(selector).css('display', updatedControlStatus[key] ? 'flex' : 'none');
    updateConfig({ controlStatus: updatedControlStatus });
  };

  const renderDom = () => {
    if (!loaded) {
      return <></>;
    }
    return (
      <div>
        <div
          style={{
            backgroundImage: `url(${logoBase64})`,
            opacity: config.muteMode ? 0 : 1
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
                        color={config.pageWidth === item ? 'accent' : 'neutral'}
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
                      checked={config.muteMode}
                      onChange={(e) => toggleMuteMode(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-gray-700 font-medium mb-1 flex items-center">
                    <span>显示控件:</span>
                  </label>
                  <div className="flex flex-wrap font-sans gap-1">
                    {controlList.map((item) => (
                      <Form.Label
                        title={item.title}
                        key={item.key}
                        className="w-16">
                        <Checkbox
                          checked={config.controlStatus[item.key]}
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

export default SettingApp;
