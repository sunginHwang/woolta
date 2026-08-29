'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { useSetAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { useUserInfo } from '../../_shared/hooks/useUserInfo';
import { useBlogRoutes } from '../../_shared/routes';
import { setPostAtom } from '../../_shared/write-store';
import { useDeletePost } from '../hooks/useDeletePost';
import { usePost } from '../hooks/usePost';

const styles = stylex.create({
  container: {
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-bgSecondary'],
  },
  heading: {
    textAlign: 'center',
    wordBreak: 'break-word',
    fontWeight: 500,
    fontSize: '2.6rem',
    lineHeight: 1.2,
    marginTop: '3rem',
    marginBottom: '5rem',
    marginInline: 0,
    color: colorVars['--color-grayPrimary'],
  },
  subInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  titleButton: {
    cursor: 'pointer',
    textAlign: 'center',
    width: '6rem',
    float: 'right',
    padding: '0.5rem',
  },
  authorImg: {
    marginRight: '1rem',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    verticalAlign: 'middle',
  },
});

export const Title = () => {
  const { push } = useRouter();
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };
  const { basePath } = useBlogRoutes();

  const { post } = usePost(categoryNo, postNo);
  const { isLogin } = useUserInfo();
  const { deletePost } = useDeletePost();
  const setPost = useSetAtom(setPostAtom);

  const handleModifyClick = () => {
    if (!post) {
      return;
    }
    const { title, categoryNo, content, postNo } = post;
    setPost({ title, content, category: String(categoryNo), postNo });
    push(`${basePath}/write`);
  };

  const handleDeleteClick = () => {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    if (!post || post.categoryNo === undefined) {
      return;
    }
    const { categoryNo, postNo } = post;
    deletePost({ categoryNo, postNo });
  };

  if (!post) {
    return null;
  }

  const { writer, title, categoryLabel, createdAt } = post;

  return (
    <div {...stylex.props(styles.container)}>
      <h1 {...stylex.props(styles.heading)}>{title}</h1>
      <div {...stylex.props(styles.subInfo)}>
        <div>
          <img {...stylex.props(styles.authorImg)} src={writer.imageUrl} alt='wooltaUserImg' />
          <Text variant='small1Regular' color='graySecondary'>
            {categoryLabel} | {createdAt}
          </Text>
        </div>
        {isLogin && (
          <div>
            <div {...stylex.props(typographyStyles.body2, styles.titleButton)} onClick={handleModifyClick}>
              수정
            </div>
            <div {...stylex.props(typographyStyles.body2, styles.titleButton)} onClick={handleDeleteClick}>
              삭제
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
