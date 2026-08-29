import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import Image from 'next/image';
import Link from 'next/link';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';
import { useUserInfo } from '../../../../hooks/queries/useUserInfo';
import { postData } from '../../../../utils/api';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: 0,
  },
  title: {
    paddingBlock: '1rem',
    paddingInline: 0,
  },
  cardWrapper: {
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: '#e6e6e6',
    borderRadius: '0.8rem',
    boxShadow: '0 0.1rem 0.3rem 0 rgba(0, 0, 0, 0.1)',
  },
  item: {
    borderTopWidth: '0.1rem',
    borderTopStyle: 'solid',
    borderTopColor: '#f2f2f2',
    height: '4.8rem',
    display: 'flex',
    paddingBlock: 0,
    paddingInline: '2rem',
  },
  linkItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  defaultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  userGroup: {
    display: 'flex',
    alignItems: 'center',
  },
  userImage: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-grayInactive'],
  },
});

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
    <section {...stylex.props(styles.container)}>
      <Text xstyle={styles.title} variant='body3' color='graySecondary' as='h3'>
        내 정보
      </Text>
      <div {...stylex.props(styles.cardWrapper)}>
        {isShareUser && (
          <div {...stylex.props(styles.item)}>
            <div {...stylex.props(styles.defaultItem)}>
              <div {...stylex.props(styles.userGroup)}>
                <Text variant='body4Regular' as='p' ml={6}>
                  공유코드 유저
                </Text>
              </div>
            </div>
          </div>
        )}
        {!isShareUser && (
          <div {...stylex.props(styles.item)}>
            <div {...stylex.props(styles.defaultItem)}>
              <div {...stylex.props(styles.userGroup)}>
                <Image
                  {...stylex.props(styles.userImage)}
                  src={userInfo.imageUrl}
                  width={24}
                  height={24}
                  alt={`${name}_유저_이미지`}
                />
                <Text variant='body4Regular' as='p' ml={6}>
                  {userInfo.name}
                </Text>
              </div>
              <Text variant='body4Regular' color='grayPrimary'>
                &gt;
              </Text>
            </div>
          </div>
        )}
        <div {...stylex.props(styles.item)} onClick={handleLogoutClick}>
          <div {...stylex.props(styles.defaultItem)}>
            <Text variant='body4Regular' color='grayPrimary'>
              로그아웃
            </Text>
            <Text variant='body4Regular' color='grayPrimary'>
              &gt;
            </Text>
          </div>
        </div>
        {!isShareUser && (
          <div {...stylex.props(styles.item)}>
            <Link {...stylex.props(styles.linkItem)} href='my-page/share-code'>
              <div {...stylex.props(styles.defaultItem)}>
                <Text variant='body4Regular' color='grayPrimary'>
                  가계부 공유하기
                </Text>
                <Text variant='body4Regular' color='grayPrimary'>
                  &gt;
                </Text>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
