import type { PlasmoCSConfig } from 'plasmo';
import { ChatBubble, Skeleton } from 'react-daisyui';

import { useWWEStore } from '~background/store-config';
import { myGetStyle } from '~core/plasmo-config';
import { beingReaderPage } from '~core/utils';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};
export const getStyle = myGetStyle;

const SkeletonApp = () => {
  const loaded = useWWEStore((state) => state.loaded);

  return (
    !loaded && beingReaderPage() && (
      <div className="fixed top-0 right-0 bottom-0 left-0 w-screen h-screen z-50">
        <Skeleton className="flex h-full items-center justify-center">
          <ChatBubble.Message>即将开启沉浸式体验</ChatBubble.Message>
        </Skeleton>
      </div>
    )
  );
};

export default SkeletonApp;
