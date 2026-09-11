'use client';

import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
import type { PostSummary } from '../_shared/types';
import PostListItem from './PostListItem';
import { PostListSkeleton } from './PostListSkeleton';

interface Props {
  post_list?: PostSummary[];
  isLoading?: boolean;
}

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    marginBlock: 0,
    marginInline: 'auto',
    paddingLeft: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1rem',
    },
    paddingRight: {
      default: 0,
      '@media (max-width: 1024px)': '2rem',
      '@media (max-width: 450px)': '1rem',
    },
  },
});

const PostList: FC<Props> = ({ post_list = [], isLoading }) => {
  if (isLoading) {
    return <PostListSkeleton />;
  }

  return (
    <div {...stylex.props(styles.container)}>
      {post_list.map((post) => (
        <PostListItem key={post.postNo} post={post} />
      ))}
    </div>
  );
};

export default Object.assign(PostList, {
  Skeleton: PostListSkeleton,
});
