import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';
import { Button } from '../../../../components/atom/Button';
import { Header } from '../../../../components/Header/Header';
import { useToast } from '../../../../hooks/useToast';
import { useBucket } from '../../detail/hooks/useBucket';
import { useBucketList } from '../../main/hooks/useBucketList';
import { useBucketFormStep } from '../hooks/useBucketFormStep';
import { useUpsertBucket } from '../hooks/useUpsertBucket';
import { bucketFormAtom } from '../store';

interface Props {
  activeForm: boolean;
  title: string;
  usePadding?: boolean;
  useScroll?: boolean;
  isValidForm: boolean;
  isShowButton?: boolean;
  children: React.ReactNode;
  onButtonClick?: () => void;
}

const styles = stylex.create({
  phaseTemplate: {
    width: '100%',
    position: 'fixed',
    top: 0,
    zIndex: zIndexConsts.phase,
    transitionProperty: 'all',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease',
    transitionDelay: '0s',
  },
  buttons: {
    position: 'absolute',
    bottom: 'calc(env(safe-area-inset-bottom) + 2rem)',
    left: '2rem',
    width: 'calc(100% - 4rem)',
    height: '5.5rem',
    zIndex: 100,
  },
});

const dynamicStyles = stylex.create({
  phaseRight: (isActive: boolean) => ({ right: isActive ? 0 : '-100%' }),
  contentPadding: (usePadding: boolean) => ({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: usePadding ? '2rem' : 0,
    paddingRight: usePadding ? '2rem' : 0,
  }),
  contentOverflow: (useScroll: boolean) => ({ overflowY: useScroll ? 'scroll' : 'hidden' }),
});

const contentBase = stylex.create({
  base: {
    minHeight: 'calc(100vh - 5.5rem)',
    height: '100%',
    backgroundColor: colorVars['--color-white'],
  },
});

export const FormTemplate: FC<Props> = ({
  activeForm,
  title,
  isValidForm,
  usePadding = true,
  useScroll = false,
  isShowButton = true,
  onButtonClick,
  children,
}) => {
  const { back, replace } = useRouter();
  const { currentStep, goNextStep, goPrevStep, isUpdateMode } = useBucketFormStep();
  const bucketForm = useAtomValue(bucketFormAtom);
  const { upsertBucketMutate } = useUpsertBucket();
  const { inValidQuery } = useBucket();
  const { refetch } = useBucketList();
  const { onToast } = useToast();

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
    upsertBucketMutate.mutate(bucketForm, {
      onSuccess: ({ data }) => {
        if (isUpdateMode) {
          inValidQuery(String(bucketForm.id));
        }
        refetch();
        replace(`/bucket-list/${data.bucketListId}`);
        onToast(`${upsertText} 되었습니다.`);
      },
      onError: () => {
        onToast(`${upsertText}에 실패하였습니다. 다시 시도해주세요`);
      },
    });
  };

  const isLastStep = currentStep === maxPhase;

  return (
    <div {...stylex.props(styles.phaseTemplate, dynamicStyles.phaseRight(activeForm))}>
      {activeForm && (
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
      <div
        {...stylex.props(
          contentBase.base,
          dynamicStyles.contentPadding(usePadding),
          dynamicStyles.contentOverflow(useScroll),
        )}
      >
        {children}
      </div>
      {isShowButton && (
        <div {...stylex.props(styles.buttons)}>
          <Button
            fill
            loading={upsertBucketMutate.isPending}
            name='bottomButton'
            disabled={!isValidForm}
            onClick={handleButtonClick}
          >
            {isLastStep ? upsertText : '다음단계'}
          </Button>
        </div>
      )}
    </div>
  );
};
