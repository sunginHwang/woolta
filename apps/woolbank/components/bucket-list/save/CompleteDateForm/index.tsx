import { useToggle } from '@common';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { FC, memo, useEffect } from 'react';
import styled from 'styled-components';
import BaseInput from '../../../common/BaseInput';
import BotttomSheet from '../../../common/BotttomSheet';
import { FormTemplate } from '../../../common/FormTemplate';
import { useBucketFormStep } from '../hooks/useBucketFormStep';
import { LabelText } from '../LabelText';
import { bucketFormAtom, setBucketCompleteDateAtom } from '../store';

interface Props {
  step: number;
}

export const CompleteDateForm: FC<Props> = memo(({ step }) => {
  const { currentStep, goNextStep } = useBucketFormStep();
  const { completeDate } = useAtomValue(bucketFormAtom);
  const setBucketCompleteDate = useSetAtom(setBucketCompleteDateAtom);

  const [isShowDateModal, setDateModal] = useToggle(false);
  const onDateModal = () => setDateModal(true);
  const offDateModal = () => setDateModal(false);
  const isActiveStep = currentStep === step;

  // 다음 입력 단계 검증
  const isValidNextPhase = completeDate.length > 0;

  useEffect(() => {
    const formAnimateDelay = 300;
    if (isActiveStep && completeDate === '') {
      setTimeout(() => {
        setDateModal(true);
      }, formAnimateDelay);
    }
  }, [completeDate, isActiveStep, setDateModal]);

  /**
   * 목표일 변경
   */
  const onChangeCompleteDate = (completeDate: string) => {
    setBucketCompleteDate({ completeDate: dayjs(completeDate).format('YYYY-MM-DD') });
    offDateModal();
    goNextStep();
  };

  /**
   * 목표일 초기화
   */
  const onResetCompleteDate = () => {
    setBucketCompleteDate({ completeDate: '' });
  };

  return (
    <FormTemplate title='목표일 설정' isValidForm={isValidNextPhase} active={isActiveStep} usePadding={false}>
      <SC.BucketListCompleteDatePhase>
        <SC.Content>
          <LabelText>
            언제 목표를 달성할 계획인지 <br /> 알려주세요.
          </LabelText>
          <BaseInput
            placeholder='클릭하여 날짜를 선택해 주세요.'
            dataType='startDate'
            name='completeDate'
            value={completeDate}
            onClick={onDateModal}
            onClear={onResetCompleteDate}
          />
          <BotttomSheet.Date
            visible={isShowDateModal}
            date={completeDate ? new Date(completeDate) : new Date()}
            onclose={offDateModal}
            onDateChange={onChangeCompleteDate}
          />
        </SC.Content>
      </SC.BucketListCompleteDatePhase>
    </FormTemplate>
  );
});

const SC = {
  BucketListCompleteDatePhase: styled.div`
    height: calc(100vh - 5.5rem);
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Content: styled.div`
    padding-top: 2rem;
    height: 100%;
  `,
};
