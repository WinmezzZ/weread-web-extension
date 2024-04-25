import $ from 'jquery';
import lottie from 'lottie-web';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  Checkbox,
  Divider,
  Drawer,
  Form,
  Kbd,
  Link,
  Modal,
  Range,
  Toggle,
  Tooltip
} from 'react-daisyui';

import { useWWEStore } from '~background/store-config';
import { myGetStyle } from '~core/plasmo-config';
import { beingReaderPage } from '~core/utils';

import { toast } from '../toast';
import { LOTTIE_JSON } from './lottie';
import { SettingIcon } from './setting-icon';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_end'
};
export const getStyle = myGetStyle;

const SettingApp = () => {
  const config = useWWEStore((state) => state.config);
  const loaded = useWWEStore((state) => state.loaded);
  const readerMode = useWWEStore((state) => state.readerMode);
  const updateConfig = useWWEStore((state) => state.updateConfig);

  const [controlList, setControlList] = useState([]);
  const [visibleWXDrawer, SetVisibleWXDrawer] = useState(false);
  const toggleWXDrawerVisible = useCallback(() => {
    SetVisibleWXPayDrawer(false);
    SetVisibleWXDrawer((visible) => !visible);
  }, []);
  const [visibleWXPayDrawer, SetVisibleWXPayDrawer] = useState(false);
  const toggleWXPayDrawerVisible = useCallback(() => {
    SetVisibleWXDrawer(false);
    SetVisibleWXPayDrawer((visible) => !visible);
  }, []);
  const ref = useRef<HTMLDialogElement>(null);
  const showModal = useCallback(() => {
    if (!beingReaderPage()) {
      toast('请在阅读页面使用!', 'error');
      return;
    }
    ref.current?.showModal();
  }, [ref]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    if (beingReaderPage()) {
      applyPageWidth(config.pageWidthPercent);
      // #region 并不是所有的书籍的控件都是一模一样的, 需要遍历DOM确定
      const allControlList = [
        {
          title: '模式',
          key: 'readerModeToggle',
          selector: '.readerControls_item.isNormalReader'
        },
        {
          title: '模式',
          key: 'readerModeToggle',
          selector: '.readerControls_item.isHorizontalReader'
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
    const $firstCSUI = $('plasmo-csui').first();
    const hostElement = $firstCSUI[0];
    if (hostElement.attachShadow && hostElement.shadowRoot) {
      var shadowRoot = hostElement.shadowRoot;
      var lottieContainer = shadowRoot.querySelector('#lottie-container');
      lottie.loadAnimation({
        container: lottieContainer,
        // 因为会跨域, 所以只能存储在本地
        animationData: LOTTIE_JSON
      });
    }
  }, [loaded]);

  const setPageWidth = (value: number) => {
    if (config.pageWidthPercent === value) {
      return;
    }
    updateConfig({ pageWidthPercent: value });
    applyPageWidth(value);
  };

  const applyPageWidth = (value: number) => {
    // 设置header部分
    $('.readerTopBar').css({
      width: `${value}%`,
      'max-width': `${value}%`
    });
    // 单栏模式的阅读部分
    $('.app_content').css({
      width: `${value}%`,
      'max-width': `${value}%`
    });
    // 双栏模式的阅读部分
    if (readerMode === 'horizontal') {
      $('.readerChapterContent.fontLevel2').css('width', `${value}%`);
    }
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
        <Drawer
          open={visibleWXDrawer}
          onClickOverlay={toggleWXDrawerVisible}
          className='z-50'
          side={
            <div className="p-4 w-80 h-full bg-white text-base-content">
              <Card>
                <Card.Image src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202404260109483.jpg" />
                <Card.Body className="items-center text-center">
                  <Card.Title tag="h2">交个朋友!</Card.Title>
                  <p>备注: 浏览器插件</p>
                </Card.Body>
              </Card>
            </div>
          }></Drawer>
        <Drawer
          open={visibleWXPayDrawer}
          onClickOverlay={toggleWXPayDrawerVisible}
          className='z-50'
          side={
            <div className="p-4 w-80 h-full bg-white text-base-content">
              <Card>
                <Card.Image src="https://eve-sama.oss-cn-shanghai.aliyuncs.com/blog/202404260110485.jpg" />
                <Card.Body className="items-center text-center">
                  <Card.Title tag="h2">开发不易, 赚钱也不易</Card.Title>
                  <p>量力而行即可, 感谢!</p>
                </Card.Body>
              </Card>
            </div>
          }></Drawer>
        <SettingIcon showModal={showModal} config={config}></SettingIcon>
        <div className="font-sans">
          <Modal ref={ref} backdrop={true}>
            <Modal.Body>
              <form className="flex flex-col">
                <Divider>插件设置</Divider>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">
                    页面宽度百分比:
                  </label>

                  <div className="flex flex-auto gap-2">
                    <Range
                      defaultValue={config.pageWidthPercent}
                      onChange={(e) => setPageWidth(parseInt(e.target.value))}
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

                <Divider>
                  {(() => {
                    if (readerMode === 'normal') {
                      return <span>快捷键说明(单栏)</span>;
                    } else if (readerMode === 'horizontal') {
                      return <span>快捷键说明(双栏)</span>;
                    }
                  })()}
                </Divider>
                <div className="mb-4">
                  {(() => {
                    if (readerMode === 'normal') {
                      return (
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
                      );
                    } else if (readerMode === 'horizontal') {
                      return (
                        <div className="font-sans flex flex-col gap-1">
                          <div>
                            <Kbd>W</Kbd>
                            <Kbd>A</Kbd>
                            <Kbd>◀︎</Kbd>: 上一页
                          </div>
                          <div>
                            <Kbd>S</Kbd>
                            <Kbd>D</Kbd>
                            <Kbd>▶︎</Kbd>: 下一页
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
                <Divider>其他</Divider>

                <div className="flex flex-wrap font-sans gap-5">
                  <Link onClick={toggleWXDrawerVisible} className="select-none">
                    联系作者
                  </Link>

                  <Link
                    onClick={toggleWXPayDrawerVisible}
                    className="select-none">
                    打赏
                  </Link>
                  <Link
                    className="select-none"
                    onClick={() =>
                      window.open(
                        'https://github.com/Eve-Sama/weread-web-extension',
                        '_blank'
                      )
                    }>
                    项目仓库
                  </Link>
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
