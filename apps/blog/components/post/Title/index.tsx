import styled from '@emotion/styled';
import layouts from '../../../style/layouts';
import { usePost } from '../hooks/usePost';
import { useUserInfo } from 'apps/blog/hooks/queries/useUserInfo';
import { useSetAtom } from 'jotai';
import { setPostAtom } from '../../write/store';
import { useRouter } from 'next/navigation';
import { useDeletePost } from '../hooks/useDeletePost';
import { Text, typography } from '@wds';

const Title = () => {
  const { push } = useRouter();
  const { post } = usePost();
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
      <h2>{title}</h2>
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

export default Title;

const SC = {
  Container: styled.div`
    padding: 0 1.6rem;
    margin-top: 4.5rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.bgSecondary};

    h2 {
      text-align: center;
      word-break: break-word;
      font-weight: 500;
      font-size: 3.4rem;
      margin: 3rem 0;
      color: ${({ theme }) => theme.colors.grayPrimary};
    }
  `,
  SubInfo: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding-bottom: 2.5rem;
    }

    span {
      color: ${({ theme }) => theme.colors.gray800};
      margin-right: 0.5rem;
      font-size: 1.6rem;
      display: inline-block;
    }

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
    margin-right: 0.5rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    vertical-align: middle;
  `,
};
