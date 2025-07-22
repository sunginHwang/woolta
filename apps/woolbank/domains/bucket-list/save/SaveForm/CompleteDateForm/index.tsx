import { useToggle } from '@common';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { ComponentProps, FC, memo, useEffect } from 'react';
import styled from 'styled-components';
import BaseInput from '../../../../common/BaseInput';
import BotttomSheet from '../../../../common/BotttomSheet';
import { FormTemplate } from '../../FormTemplate';
import { useBucketFormStep } from '../../hooks/useBucketFormStep';
import { LabelText } from '../../LabelText';
import { bucketFormAtom, setBucketCompleteDateAtom } from '../../store';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

export const CompleteDateForm: FC<Props> = memo(({ activeForm }) => {
  const { goNextStep } = useBucketFormStep();
  const { completeDate } = useAtomValue(bucketFormAtom);
  const setBucketCompleteDate = useSetAtom(setBucketCompleteDateAtom);

  const [isShowDateModal, setDateModal] = useToggle(false);
  const onDateModal = () => setDateModal(true);
  const offDateModal = () => setDateModal(false);

  const isValidForm = completeDate.length > 0;

  // Form 노출시 date 바텀싯 노출 (ux)
  useEffect(() => {
    const formAnimateDelay = 300;
    if (activeForm && completeDate === '') {
      setTimeout(() => {
        setDateModal(true);
      }, formAnimateDelay);
    }
  }, [completeDate, activeForm, setDateModal]);

  const onChangeCompleteDate = (completeDate: string) => {
    setBucketCompleteDate({ completeDate: dayjs(completeDate).format('YYYY-MM-DD') });
    offDateModal();
    goNextStep();
  };

  const onResetCompleteDate = () => {
    setBucketCompleteDate({ completeDate: '' });
  };

  return (
    <FormTemplate title='목표일 설정' isValidForm={isValidForm} activeForm={activeForm} usePadding={false}>
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
