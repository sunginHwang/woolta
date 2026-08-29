import { cleanup, render } from '@testing-library/react';
import NotificationBar from './NotificationBar';

afterEach(cleanup);

describe('<NotificationBar />', () => {
  it('matches snapshot', () => {
    // NotificationBar 는 StyleX 로 전환돼 테마 프로바이더가 필요 없다
    const utils = render(<NotificationBar isShow={true} message='message' />);
    expect(utils.container).toMatchSnapshot();
  });
});
