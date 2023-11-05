import { FC } from 'react';
import { Post } from '.';
import styled from '@emotion/styled';
import layouts from 'apps/blog/style/layouts';
import Link from 'next/link';
import Text from '../../base/Text';

interface Props {
  post: Post;
}

const Item: FC<Props> = ({ post }) => {
  return (
    <SC.Container>
      <Link href={`/categories/${post.categoryNo}/posts/${post.postNo}`}>
        <Text className='title' variant='title3Bold' color='grayPrimary' as='h2' mb={8}>
          {post.title}
        </Text>
        <Text className='content' variant='body3' color='graySecondary' as='p' mb={15}>
          {post.subDescription}
        </Text>
        <SC.SubInfo>
          <SC.Chip>
            <Text variant='small3Bold' color='graySecondary' className='label'>
              {post.categoryLabel}
            </Text>
          </SC.Chip>
          <Text variant='small1Regular' color='grayTertiary' className='meta'>
            {post.createdAt}
          </Text>
        </SC.SubInfo>
      </Link>
    </SC.Container>
  );
};

export default Item;

const SC = {
  Container: styled.article`
    text-align: left;
    padding: 1.6rem 0;
    border-bottom: 0.1rem solid rgb(244, 244, 244);
    cursor: pointer;

    @media screen and (max-width: ${layouts.phoneWidth}) {
    }

    .content {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
    }
  `,
  SubInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
  `,
  Chip: styled.div`
    padding: 3px 8px 4px 8px;
    background-color: ${({ theme }) => theme.colors.bgSecondary};
    border-radius: 40px;
    display: flex;
    align-items: center;
  `,
};
