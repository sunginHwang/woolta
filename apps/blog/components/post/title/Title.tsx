'use client';

import { Text, typography } from '@wds';
import { useSetAtom } from 'jotai';
import { useParams, useRouter } from 'next/navigation';
import { styled } from 'styled-components';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import { setPostAtom } from '../../write/store';
import { useDeletePost } from '../hooks/useDeletePost';
import { usePost } from '../hooks/usePost';

export const Title = () => {
  const { push } = useRouter();
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };

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
    push('/write');
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
    <SC.Container>
      <h1>{title}</h1>
      <SC.SubInfo>
        <div>
          <SC.AuthorImg src={writer.imageUrl} alt='wooltaUserImg' />
          <Text variant='small1Regular' color='graySecondary'>
            {categoryLabel} | {createdAt}
          </Text>
        </div>
        {isLogin && (
          <div>
            <SC.TitleButton onClick={handleModifyClick}>수정</SC.TitleButton>
            <SC.TitleButton onClick={handleDeleteClick}>삭제</SC.TitleButton>
          </div>
        )}
      </SC.SubInfo>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.bgSecondary};

    h1 {
      text-align: center;
      word-break: break-word;
      font-weight: 500;
      font-size: 2.6rem;
      line-height: 1.2;
      margin: 3rem 0 5rem;
      color: ${({ theme }) => theme.colors.grayPrimary};
    }
  `,
  SubInfo: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    img {
      width: 3rem;
      height: 3rem;
    }
  `,
  TitleButton: styled.div`
    ${typography.body2}
    cursor: pointer;
    text-align: center;
    width: 6rem;
    float: right;
    padding: 0.5rem;
  `,
  AuthorImg: styled.img`
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    vertical-align: middle;
  `,
};
