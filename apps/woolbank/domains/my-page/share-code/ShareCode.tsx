'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Button } from '../../../components/atom/Button';
import { Header } from '../../../components/Header/Header';
import { useToast } from '../../../hooks/useToast';
import { useShareCode } from './_common/hooks/useShareCode';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  card: {
    marginTop: '2rem',
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-gray150'],
  },
  codeInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '2rem',
  },
  shareCodeBox: {
    width: '100%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-gray600'],
    borderRadius: '0.8rem',
    paddingBlock: '0.8rem',
    paddingInline: '1.6rem',
    marginRight: '1rem',
  },
  shareButtonWrapper: {
    marginTop: '2rem',
  },
  copyButtonWrapper: {
    minWidth: '8rem',
  },
});

export const ShareCode = () => {
  const { onToast } = useToast();
  const { shareCode, isExistShareCode, upsertShareCodeMutation } = useShareCode();

  const handleShareCodeCopyClick = () => {
    navigator.clipboard.writeText(shareCode);
    onToast('공유코드를 복사하였습니다.');
  };

  return (
    <>
      <Header.Sub title='가계부 공유하기' />
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.card)}>
          <Text variant='body3' color='gray700'>
            가계부를 공유해보세요. <br />
            가계부 내역을 공유하고 싶은 상대방에게 공유코드를 발급해 공유해주세요.
            <br />
            공유된 공유코드를 통해 로그인안 상대방에게 작성하신 가계부 내역 및 통계내역 확인이 가능합니다.! <br />
            공유코드를 통해 접근한 유저는 가계부 정보 관련 열람만 가능한점 참고 부탁드려요.
          </Text>
        </div>
        {isExistShareCode && (
          <div {...stylex.props(styles.codeInfo)}>
            <div {...stylex.props(styles.shareCodeBox)}>
              <Text variant='title2Bold' color='gray900' as='p'>
                {shareCode}
              </Text>
            </div>
            <div {...stylex.props(styles.copyButtonWrapper)}>
              <Button onClick={handleShareCodeCopyClick}>복사</Button>
            </div>
          </div>
        )}
        <div {...stylex.props(styles.shareButtonWrapper)}>
          <Button
            fill
            loading={upsertShareCodeMutation.isPending}
            onClick={() => {
              upsertShareCodeMutation.mutate();
            }}
          >
            공유 코드 {isExistShareCode ? '재' : ''}발급하기
          </Button>
        </div>
      </div>
    </>
  );
};
