import { Text } from '@wds';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from 'styled-components';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { postData } from '../../../../utils/api';
import { useConfirm } from '../../../../components/confirm/ConfirmContext';

export const UserInfoCard = () => {
  const { userInfo, isShareUser } = useUserInfo();
  const { openConfirm } = useConfirm();

  const handleLogoutClick = async () => {
    const isOK = await openConfirm({ message: '정말 로그아웃 하시겠습니까?' });

    if (isOK) {
      await postData('/user/logout');
      location.reload();
    }
  };

  if (!userInfo) {
    return null;
  }
  return (
    <SC.Container>
      <Text variant='body3' color='graySecondary' as='h3' className='title'>
        내 정보
      </Text>
      <div>
        {isShareUser && (
          <SC.Item>
            <SC.DefaultItem>
              <div className='user'>
                <Text variant='body4Regular' as='p' ml={6}>
                  공유코드 유저
                </Text>
              </div>
            </SC.DefaultItem>
          </SC.Item>
        )}
        {!isShareUser && (
          <SC.Item>
            <SC.DefaultItem>
              <div className='user'>
                <Image src={userInfo.imageUrl} width={24} height={24} alt={`${name}_유저_이미지`} />
                <Text variant='body4Regular' as='p' ml={6}>
                  {userInfo.name}
                </Text>
              </div>
              <Text variant='body4Regular' color='grayPrimary'>
                &gt;
              </Text>
            </SC.DefaultItem>
          </SC.Item>
        )}
        <SC.Item onClick={handleLogoutClick}>
          <SC.DefaultItem>
            <Text variant='body4Regular' color='grayPrimary'>
              로그아웃
            </Text>
            <Text variant='body4Regular' color='grayPrimary'>
              &gt;
            </Text>
          </SC.DefaultItem>
        </SC.Item>
        {!isShareUser && (
          <SC.Item>
            <Link className='link' href='my-page/share-code'>
              <SC.DefaultItem>
                <Text variant='body4Regular' color='grayPrimary'>
                  가계부 공유하기
                </Text>
                <Text variant='body4Regular' color='grayPrimary'>
                  &gt;
                </Text>
              </SC.DefaultItem>
            </Link>
          </SC.Item>
        )}
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.section`
    .title {
      padding: 1rem 0;
    }
    > div {
      border: 0.1rem solid #e6e6e6;
      border-radius: 0.8rem;
      box-shadow: 0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1);
    }
  `,
  UserCardItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    height: 4.8rem;

    div {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      p {
        margin-left: 0.6rem;
      }
    }
  `,
  Item: styled.div`
    border-top: 0.1rem solid #f2f2f2;
    height: 4.8rem;
    display: flex;
    padding: 0 2rem;

    .link {
      width: 100%;
      display: flex;
      align-items: center;
    }
  `,
  DefaultItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .user {
      display: flex;
      align-items: center;

      img {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        border: 0.1rem solid ${({ theme }) => theme.colors.grayInactive};
      }
    }
  `,
};
