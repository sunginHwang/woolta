import styled from '@emotion/styled';
import layouts from 'apps/blog/style/layouts';
import { FC } from 'react';
import PostListSkeleton from './Skeleton';
import Item from './Item';

export interface Post {
  postNo: number;
  title: string;
  subDescription?: string;
  categoryLabel: string;
  categoryNo?: number;
  createdAt: string;
  authorNo?: string;
  author?: string;
  content?: string;
  writer?: Writer;
}

export interface Writer {
  no: number;
  nickName: string;
  imageUrl: string;
}

interface Props {
  post_list?: Post[];
  isLoading?: boolean;
}

const PostList: FC<Props> = ({ post_list = [], isLoading }) => {
  if (isLoading) {
    return <PostListSkeleton />;
  }

  return (
    <SC.Container>
      {post_list.map((post) => (
        <Item key={post.postNo} post={post} />
      ))}
    </SC.Container>
  );
};

export default Object.assign(PostList, {
  Skeleton: PostListSkeleton,
});

const SC = {
  Container: styled.div`
    max-width: ${layouts.contentMaxWidth};
    margin: 0 auto;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  `,
};
