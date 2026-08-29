'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import type { FC } from 'react';
import { useBlogRoutes } from '../_shared/routes';
import type { IPost } from '../_shared/types/IPost';

interface Props {
  post: IPost;
}

const styles = stylex.create({
  container: {
    textAlign: 'left',
    paddingBlock: '1.6rem',
    paddingInline: 0,
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: 'rgb(244, 244, 244)',
    cursor: 'pointer',
  },
  contentClamp: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: 2,
  },
  subInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  chip: {
    paddingTop: '3px',
    paddingBottom: '4px',
    paddingInline: '8px',
    backgroundColor: colorVars['--color-bgSecondary'],
    borderRadius: '40px',
    display: 'flex',
    alignItems: 'center',
  },
});

const PostListItem: FC<Props> = ({ post }) => {
  const { basePath } = useBlogRoutes();

  return (
    <article {...stylex.props(styles.container)}>
      <Link href={`${basePath}/categories/${post.categoryNo}/posts/${post.postNo}`}>
        <Text variant='title3Bold' color='grayPrimary' as='h2' mb={8}>
          {post.title}
        </Text>
        <Text xstyle={styles.contentClamp} variant='body3' color='graySecondary' as='p' mb={15}>
          {post.subDescription}
        </Text>
        <div {...stylex.props(styles.subInfo)}>
          <div {...stylex.props(styles.chip)}>
            <Text variant='small3Bold' color='graySecondary'>
              {post.categoryLabel}
            </Text>
          </div>
          <Text variant='small1Regular' color='grayTertiary'>
            {post.createdAt}
          </Text>
        </div>
      </Link>
    </article>
  );
};

export default PostListItem;
