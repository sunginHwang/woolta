import React from 'react';
import BucketListItem from '@components/bucketList/list/BucketListItem';
import withThemeRender from '@support/test/withThemeRender';
import { IBucketList } from '@models/bucketList/IBucketList';
import { remainDays } from '@support/util/date';

const initState: IBucketList = {
  title: '제목',
  completeDate: '2030-02-02',
  todoCount: 3,
  completeTodoCount: 1,
  image: {
    thumbImageUrl: 'imgUrl',
    fullImageUrl: ''
  }
};

describe('<BucketListItem />', () => {
  const setup = (bucketList: IBucketList = initState) => {
    const utils = withThemeRender(<BucketListItem bucketList={bucketList} />);

    return {
      ...utils
    };
  };

  it('기본값 입력 정상 렌더링 노출 확인', () => {
    const { getAllByText } = setup();
    getAllByText(initState.title);
    getAllByText(`D-${remainDays(new Date(), initState.completeDate)}`);

    if (initState.image) {
      getAllByText(initState.image.fullImageUrl);
    }

    const remainTodoCount = initState.todoCount - initState.completeTodoCount;

    getAllByText(`${remainTodoCount}개의 할 일이 남았어요.`);
  });

  it('남은 할일이 없는 경우 할일이 없다고 노출', () => {
    const bck = Object.assign(initState, { todoCount: 1, completeTodoCount: 1 });
    const { getByText } = setup(bck);
    getByText('모든 할일을 마치셨습니다.');
  });

  it('dDay 끝난 경우 D-day 표기 x', () => {
    const bck = Object.assign(initState, { completeDate: '2010-01-01' });
    const { queryByText } = setup(bck);
    expect(queryByText('D-')).toBeNull();
  });
});
