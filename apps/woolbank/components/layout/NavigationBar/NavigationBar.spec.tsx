import React from 'react';

import NavigationBar from '@components/layout/NavigationBar';

import withThemeRender from '@support/test/withThemeRender';
import theme from '@style/theme';

describe('<NavigationBar />', () => {
  const setup = () => {
    const utils = withThemeRender(<NavigationBar />);
    return {
      ...utils
    };
  };

  it('컴포넌트 생성시 메뉴 정상적으로 렌더링', () => {
    const { getByText } = setup();
    getByText('홈');
    getByText('자산관리');
    getByText('버킷리스트');
    getByText('내 정보');

    const homeEl = getByText('홈');
    const walletEl = getByText('자산관리');
    const bucketListEl = getByText('버킷리스트');
    const meEl = getByText('내 정보');
    // 홈화면만 활성화
    expect(homeEl).toHaveStyle(`color: ${theme.colors.mainColor}`);
    expect(walletEl).toHaveStyle(`color: ${theme.colors.greyD2}`);
    expect(bucketListEl).toHaveStyle(`color: ${theme.colors.greyD2}`);
    expect(meEl).toHaveStyle(`color: ${theme.colors.greyD2}`);
  });
});
