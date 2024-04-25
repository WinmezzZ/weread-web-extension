import type { Config } from "~types/config";

export const config = {
  matches: ['https://weread.qq.com/*'],
  run_at: 'document_start'
};

type Props = {
  showModal: () => void;
  config: Config;
};

export function SettingIcon({ showModal, config }: Props) {
  return (
    <div
      id="lottie-container"
      className="fixed w-12 h-12 left-4 top-3 cursor-pointer"
      style={{
        opacity: config.muteMode ? 0 : 1,
      }}
      onClick={showModal}>
    </div>
  );
}

const NullContent = () => {
  return <></>;
};

export default NullContent;