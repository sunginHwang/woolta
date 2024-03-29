import { useEffect, useState } from 'react';

export const useTheme = () => {
  let initTheme = 'white';

  if (typeof window !== 'undefined') {
    const isBrowserDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    initTheme = isBrowserDarkMode ? 'dark' : '';

    const localSettingTheme = localStorage.getItem('wt-theme');

    if (localSettingTheme) {
      initTheme = localSettingTheme;
    }
  }

  const [theme, setTheme] = useState(initTheme);

  const setThemeMode = (mode: string) => {
    window.localStorage.setItem('wt-theme', mode);
    setTheme(mode);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('light');
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('wt-theme');
    if (localTheme) {
      setTheme(localTheme);
    } else {
      let initTheme = 'white';

      if (typeof window !== 'undefined') {
        const isBrowserDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isBrowserDarkMode) {
          initTheme = 'dark';
        }
      }
      setThemeMode(initTheme);
    }
  }, []);

  return [theme, toggleTheme];
};
