import { useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import dayjs from 'dayjs';
import { useAtomValue, useSetAtom } from 'jotai';
import { type ComponentProps, type FC, memo, useEffect } from 'react';
import { BaseInput } from '../../../../../components/base-input/BaseInput';
import { BottomSheet } from '../../../../../components/bottom-sheet/BottomSheet';
import { FormTemplate } from '../../FormTemplate';
import { useBucketFormStep } from '../../hooks/useBucketFormStep';
import { LabelText } from '../../LabelText';
import { bucketFormAtom, setBucketCompleteDateAtom } from '../../store';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

const styles = stylex.create({
  phase: {
    height: 'calc(100vh - 5.5rem)',
    paddingBlock: 0,
    paddingInline: '2rem',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-white'],
  },
  content: {
    paddingTop: '2rem',
    height: '100%',
  },
});

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
      <div {...stylex.props(styles.phase)}>
        <div {...stylex.props(styles.content)}>
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
          <BottomSheet.Date
            visible={isShowDateModal}
            date={completeDate ? new Date(completeDate) : new Date()}
            onclose={offDateModal}
            onDateChange={onChangeCompleteDate}
          />
        </div>
      </div>
    </FormTemplate>
  );
});
