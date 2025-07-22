import React from 'react';
import CardItem from '@components/common/CardItem';
import withThemeRender from '@support/test/withThemeRender';

describe('<CardItem />', () => {
  const setup = () => {
    const utils = withThemeRender(<CardItem><p>12</p></CardItem>);
    return {
      ...utils
    };
  };

  it('is exist render children', () => {
    const { getByText } = setup();
    expect(getByText('12').textContent).toBe('12');
  });
});
