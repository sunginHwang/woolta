import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
import Item from './Item';
import { PostListSkeleton } from './PostListSkeleton';

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

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    marginBlock: 0,
    marginInline: 'auto',
    paddingLeft: {
      default: null,
      '@media screen and (max-width: 1024px)': '2rem',
      '@media screen and (max-width: 450px)': '1rem',
    },
    paddingRight: {
      default: null,
      '@media screen and (max-width: 1024px)': '2rem',
      '@media screen and (max-width: 450px)': '1rem',
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
        <Item key={post.postNo} post={post} />
      ))}
    </div>
  );
};

export default Object.assign(PostList, {
  Skeleton: PostListSkeleton,
});
