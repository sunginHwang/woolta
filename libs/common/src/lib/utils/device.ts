declare global {
  interface Window {
    MSStream?: string;
  }
}

export const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
