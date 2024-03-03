import { Text } from '@wds';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../atom/Button';
import { useBucketFormStep } from '../../bucket-list/save/hooks/useBucketFormStep';
import { useUpsertBucket } from '../../bucket-list/save/hooks/useUpsertBucket';
import { bucketFormAtom } from '../../bucket-list/save/store';
import Header from '../Header';

interface Props {
  // 헤더 사용 유무
  active: boolean;
  title: string;
  usePadding?: boolean;
  useScroll?: boolean;
  isValidForm: boolean;
  isShowButton?: boolean;
  children: React.ReactNode;
  onButtonClick?: () => void;
}

export const FormTemplate: FC<Props> = ({
  active,
  title,
  isValidForm,
  usePadding = true,
  useScroll = false,
  isShowButton = true,
  onButtonClick,
  children,
}) => {
  const { back, push } = useRouter();
  const { currentStep, goNextStep, goPrevStep, isUpdateMode } = useBucketFormStep();
  const bucketForm = useAtomValue(bucketFormAtom);
  const { upsertBucketMutate } = useUpsertBucket();
  const maxPhase = isUpdateMode ? 3 : 4;

  const upsertText = `버킷리스트 ${isUpdateMode ? '수정' : '작성'}`;

  const handleButtonClick = () => {
    if (!isLastStep) {
      goNextStep();
    } else {
      upsertBucket();
    }
    onButtonClick?.();
  };

  const handleBackClick = () => {
    if (currentStep === 1) {
      back();
      return;
    }

    goPrevStep();
  };

  const upsertBucket = () => {
    push('/bucket-list');
    // upsertBucketMutate.mutate(bucketForm, {
    //   onSuccess: () => {
    //     window.history.go(-maxPhase);
    //     push('/bucket-list');
    //     alert(`${upsertText} 되었습니다.`);
    //   },
    //   onError: () => {
    //     alert(`${upsertText}에 실패하였습니다. 다시 시도해주세요`);
    //   },
    // });
  };

  const isLastStep = currentStep === maxPhase;

  return (
    <SC.PhaseTemplate active={active}>
      {active && (
        <Header.Sub
          title={title}
          right={
            <Text variant='body4Regular' color='gray700'>
              {currentStep}/{maxPhase}
            </Text>
          }
          onBackClick={handleBackClick}
        />
      )}
      <SC.Content useScroll={useScroll} usePadding={usePadding}>
        {children}
      </SC.Content>
      {isShowButton && (
        <SC.Buttons>
          <Button
            fill
            loading={upsertBucketMutate.isPending}
            name='bottomButton'
            disabled={!isValidForm}
            onClick={handleButtonClick}
          >
            {isLastStep ? upsertText : '다음단계'}
          </Button>
        </SC.Buttons>
      )}
    </SC.PhaseTemplate>
  );
};

type ContentProps = {
  usePadding: boolean;
  useScroll: boolean;
};
const SC = {
  PhaseTemplate: styled.div<{ active: boolean }>`
    width: 100%;
    position: relative;
    position: fixed;
    top: 0;
    right: ${({ active }) => (active ? 0 : '-100%')};
    z-index: ${({ theme }) => theme.zIndex.phase};
    transition: all 0.3s ease 0s;
  `,
  Content: styled.div<ContentProps>`
    padding: ${({ usePadding }) => (usePadding ? '0 2rem 0 2rem' : '0 0 0 0')};
    overflow-y: ${({ useScroll }) => (useScroll ? 'scroll' : 'hidden')};
    min-height: calc(100vh - 5.5rem);
    height: 100%;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Buttons: styled.div`
    position: absolute;
    bottom: 2rem;
    bottom: calc(constant(safe-area-inset-bottom) + 2rem);
    bottom: calc(env(safe-area-inset-bottom) + 2rem);
    left: 2rem;
    width: calc(100% - 4rem);
    height: 5.5rem;
    z-index: 100;
  `,
};
