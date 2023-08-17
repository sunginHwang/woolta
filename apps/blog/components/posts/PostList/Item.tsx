import { FC } from 'react';
import { Post } from '.';
import styled from '@emotion/styled';
import { colors } from 'apps/blog/style/colors';
import layouts from 'apps/blog/style/layouts';
import Link from 'next/link';
import Text from '../../base/SkeletonBar/Text';

interface Props {
  post: Post;
}

const Item: FC<Props> = ({ post }) => {
  return (
    <SC.Container>
      <Link href={`/categories/${post.categoryNo}/posts/${post.postNo}`}>
        <Text className='title' variant='title1_bold' color='green200' as='h2' mb={10}>
          {post.title}
        </Text>
        <Text className='content' variant='body1' color='green200' as='p' mb={10}>
          {post.subDescription}
        </Text>
        <SC.SubInfo>
          <Text variant='small3_bold' color='gray600' className='label'>
            {post.categoryLabel}
          </Text>
          <Text variant='small3_regular' color='gray400' className='separator'>
            |
          </Text>
          <Text variant='small3_regular' color='gray400' className='meta'>
            {post.author}
          </Text>
          <Text variant='small3_regular' color='gray400' className='separator'>
            |
          </Text>
          <Text variant='small3_regular' color='gray400' className='meta'>
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
    padding-bottom: 1.6rem;
    padding-top: 2.72rem;
    border-bottom: 0.1rem solid ${colors.gray400};

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding-bottom: 0.8rem;
      padding-top: 1.92rem;
    }

    .title {
      margin-bottom: 1rem;
      cursor: pointer;
    }

    .content {
      max-width: 80%;
    }
  `,
  SubInfo: styled.div`
    .separator {
      margin-right: 0.5rem;
    }

    .meta {
      margin-right: 0.5rem;
    }

    .label {
      margin-right: 1rem;
    }
  `,
};
