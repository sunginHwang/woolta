export const getCookie = (name: string) => {
  if (typeof window === 'undefined') {
    return '';
  }

  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
};
