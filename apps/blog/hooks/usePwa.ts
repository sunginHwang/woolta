import { useMount } from '@common';
import { initSubscribe } from '../pwa/pushConfig';

export const usePwa = () => {
  useMount(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker
        .register('/service-worker.js')
        .then(initSubscribe)
        .catch((e) => console.log(e));
    }
  });
};
