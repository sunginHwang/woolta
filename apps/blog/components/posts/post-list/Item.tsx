import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import type { FC } from 'react';
import type { Post } from './PostList';

interface Props {
  post: Post;
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
  content: {
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

const Item: FC<Props> = ({ post }) => {
  return (
    <article {...stylex.props(styles.container)}>
      <Link href={`/categories/${post.categoryNo}/posts/${post.postNo}`}>
        <Text variant='title3Bold' color='grayPrimary' as='h2' mb={8}>
          {post.title}
        </Text>
        <Text xstyle={styles.content} variant='body3' color='graySecondary' as='p' mb={15}>
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

export default Item;
