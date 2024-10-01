'use client';

import { Text } from '@wds';
import { styled } from 'styled-components';
import { useToast } from '../../../hooks/useToast';
import { Button } from '../../atom/Button';
import Header from '../../common/Header';
import { useShareCode } from './hooks/useShareCode';

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
      <SC.Container>
        <SC.Card>
          <Text variant='body3' color='gray700'>
            가계부를 공유해보세요. <br />
            가계부 내역을 공유하고 싶은 상대방에게 공유코드를 발급해 공유해주세요.
            <br />
            공유된 공유코드를 통해 로그인안 상대방에게 작성하신 가계부 내역 및 통계내역 확인이 가능합니다.! <br />
            공유코드를 통해 접근한 유저는 가계부 정보 관련 열람만 가능한점 참고 부탁드려요.
          </Text>
        </SC.Card>
        {isExistShareCode && (
          <SC.CodeInfo>
            <SC.ShareCode>
              <Text variant='title2Bold' color='gray900' as='p'>
                {shareCode}
              </Text>
            </SC.ShareCode>
            <Button className='copy' onClick={handleShareCodeCopyClick}>
              복사
            </Button>
          </SC.CodeInfo>
        )}
        <Button
          className='share-button'
          fill
          loading={upsertShareCodeMutation.isPending}
          onClick={() => {
            upsertShareCodeMutation.mutate();
          }}
        >
          공유 코드 {isExistShareCode ? '재' : ''}발급하기
        </Button>
      </SC.Container>
    </>
  );
};

const SC = {
  Container: styled.div`
    padding: 0 1.6rem;

    .share-button {
      margin-top: 2rem;
    }
  `,
  Card: styled.div`
    margin-top: 2rem;
    padding: 1.6rem;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.gray150};
  `,
  CodeInfo: styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 2rem;

    .copy {
      min-width: 8rem;
    }
  `,
  ShareCode: styled.div`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.gray600};
    border-radius: 0.8rem;
    padding: 0.8rem 1.6rem;
    margin-right: 1rem;
  `,
};
