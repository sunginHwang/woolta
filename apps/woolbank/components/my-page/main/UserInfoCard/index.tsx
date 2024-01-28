import { styled } from 'styled-components';
import { Text } from '@wds';
import Image from 'next/image';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';

const UserInfoCard = () => {
  const { userInfo } = useUserInfo();

  if (!userInfo) {
    return null;
  }
  console.log(userInfo);
  return (
    <SC.Container>
      <Text variant='body3' color='graySecondary' as='h3' className='title'>
        내 정보
      </Text>
      <div>
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
        <SC.Item>
          <SC.DefaultItem>
            <Text variant='body4Regular' color='grayPrimary'>
              로그아웃
            </Text>
            <Text variant='body4Regular' color='grayPrimary'>
              &gt;
            </Text>
          </SC.DefaultItem>
        </SC.Item>
      </div>
    </SC.Container>
  );
};

export default UserInfoCard;

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
