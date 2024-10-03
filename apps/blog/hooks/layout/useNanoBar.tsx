import { useMount } from '@common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Nano from 'nanobar';

const CLASS_NAME = 'nanoBarLoading';

declare global {
  interface Window {
    nanoBarLoading?: any;
  }
}

const NanoBarLoading = () => {
  useMount(() => {
    const loadingBar = new Nano({
      classname: CLASS_NAME,
      id: CLASS_NAME,
    });

    window['nanoBarLoading'] = loadingBar;
    return () => {
      window['nanoBarLoading'] = null;
    };
  });

  return null;
};

export default NanoBarLoading;
