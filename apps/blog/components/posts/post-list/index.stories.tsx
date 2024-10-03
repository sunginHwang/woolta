import type { Meta, StoryObj } from '@storybook/react';
import PostList from './PostList';

const meta: Meta<typeof PostList> = { component: PostList };
export default meta;

type Story = StoryObj<typeof PostList>;

export const Post리스트: Story = {
  args: {
    post_list: [
      {
        postNo: 120,
        title: 'js generator 란 무엇인가.',
        subDescription:
          '이번 toyProject에서  reduxsaga를 사용하려고 하기 위해 generator 를 배우게 된 경험을 공유 하려 한다 generator제너레이터함수 yield 키워드로 표...',
        categoryLabel: 'javaScript',
        categoryNo: 3,
        createdAt: '2018-10-21',
        author: 'b00032',
      },
      {
        postNo: 143,
        title: 'Object.defineProperty 에 대하여 알아보기',
        subDescription:
          ' ObjectdefinePropertyES5 스펙 에서 생긴 ObjectdefineProperty 는 객체에 직접 새로운 속성을 정의하거나 이미 존재하는 속성을 수정하고 수정된 객...',
        categoryLabel: 'javaScript',
        categoryNo: 3,
        createdAt: '2019-07-06',
        author: 'b00032',
      },
      {
        postNo: 138,
        title: 'async / await 최적화 방법 (병렬처리) ',
        subDescription:
          'async await  은 비동기 처리를 위해 ES2017 부터 생성된 문법입니다 async await  을 사용하게 되면 promise 보다 더욱 직관적인 코드를 짤 수 있게 됩...',
        categoryLabel: 'javaScript',
        categoryNo: 3,
        createdAt: '2019-06-09',
        author: 'b00032',
      },
    ],
  },
};

export const 로딩중: Story = { args: { post_list: [], isLoading: true } };
