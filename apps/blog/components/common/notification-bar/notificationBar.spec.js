import { cleanup, render } from '@testing-library/react';
import { theme } from '@wds';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import NotificationBar from './NotificationBar';

afterEach(cleanup);

const shallowWithTheme = (component) => {
  return render(<ThemeProvider theme={theme.light}>{component}</ThemeProvider>);
};

describe('<NotificationBar />', () => {
  it('matches snapshot', () => {
    const utils = shallowWithTheme(<NotificationBar isShow={true} message='message' />);
    expect(utils.container).toMatchSnapshot();
  });
});
