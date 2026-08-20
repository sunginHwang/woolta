'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BottomSheet } from '../../_shared/bottom-sheet/BottomSheet';
import { BaseInput } from '../../_shared/components/base-input/BaseInput';
import { Button } from '../../_shared/components/button/Button';
import { ToggleTab } from '../../_shared/components/toggle-tab/ToggleTab';
import { ScheduledPaymentType } from '../_common/hooks/useAccountBookForm';

const TAB_LIST = [
  { type: 'repeat', name: '반복' },
  { type: 'installment', name: '할부' },
];

const VALUE_INFO_MAPPER: Record<ScheduledPaymentType, { label: string; placeholder: string }> = {
  repeat: {
    label: '매월 지출일',
    placeholder: '매 월 지출되는 일자를 입력해주세요.',
  },
  installment: {
    label: '매월 할부 지출일',
    placeholder: '매 월 지출되는 할부 일자를 입력해주세요.',
  },
};

interface Props {
  is_open?: boolean;
  scheduledPaymentDay?: number;
  scheduledPaymentType?: ScheduledPaymentType;
  installmentMonth?: number;
  setSaveScheduledPayments?: (props: {
    scheduledPaymentDay: number;
    scheduledPaymentType: ScheduledPaymentType;
    installmentMonth?: number;
  }) => void;
  onCloseModal?: () => void;
}

export const ScheduledPaymentBottomSheet = ({
  is_open,
  scheduledPaymentDay,
  scheduledPaymentType,
  installmentMonth,
  setSaveScheduledPayments,
  onCloseModal,
}: Props) => {
  const [scheduledPaymentsTypeState, setScheduledPaymentsTypeState] = useState<ScheduledPaymentType>('repeat');
  const [schedulePaymentValueState, setSchedulePaymentValue] = useState<'' | number>('');
  const [installmentMonthState, setInstallmentMonthState] = useState<'' | number>('');

  useEffect(() => {
    if (scheduledPaymentDay) {
      setSchedulePaymentValue(scheduledPaymentDay);
    }
  }, [scheduledPaymentDay]);

  useEffect(() => {
    if (scheduledPaymentType) {
      setScheduledPaymentsTypeState(scheduledPaymentType);
    }
  }, [scheduledPaymentType]);

  const handleSchedulePaymentValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isNumber = !isNaN(Number(e.target.value));
    if (isNumber) {
      setSchedulePaymentValue(Number(e.target.value));
    }
  };

  const handleInstallmentMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isNumber = !isNaN(Number(e.target.value));
    if (isNumber) {
      setInstallmentMonthState(Number(e.target.value));
    }
  };

  const handleSaveClick = () => {
    if (schedulePaymentValueState && isEnableFormStatus) {
      setSaveScheduledPayments?.({
        scheduledPaymentDay: schedulePaymentValueState,
        scheduledPaymentType: scheduledPaymentsTypeState,
        installmentMonth: Number(installmentMonthState),
      });
    }
  };

  const { placeholder, label } = VALUE_INFO_MAPPER[scheduledPaymentsTypeState];
  const isValidInstallment =
    scheduledPaymentsTypeState === 'installment' &&
    !!schedulePaymentValueState &&
    schedulePaymentValueState > 0 &&
    !!installmentMonthState &&
    installmentMonthState > 0 &&
    installmentMonthState <= 31;
  const isValidRepeat =
    scheduledPaymentsTypeState === 'repeat' &&
    !!schedulePaymentValueState &&
    schedulePaymentValueState > 0 &&
    schedulePaymentValueState <= 31;
  const isEnableFormStatus = isValidInstallment || isValidRepeat;

  return (
    <BottomSheet visible={is_open} oncloseModal={onCloseModal} title='반복/할부'>
      <SC.Content>
        <ToggleTab
          tabs={TAB_LIST}
          value={scheduledPaymentsTypeState}
          onChangeTab={(tab) => {
            setSchedulePaymentValue('');
            setInstallmentMonthState('');
            setScheduledPaymentsTypeState(tab.type as ScheduledPaymentType);
          }}
        />
        <div className='input-group'>
          <BaseInput
            type='number'
            onChange={handleSchedulePaymentValueChange}
            value={schedulePaymentValueState}
            placeholder={placeholder}
            isShowCloseBtn={false}
            label={label}
          />
          {scheduledPaymentsTypeState === 'installment' && (
            <BaseInput
              type='number'
              onChange={handleInstallmentMonthChange}
              value={installmentMonthState}
              placeholder='할부 개월 수를 입력해주세요.'
              isShowCloseBtn={false}
              label='할부 개월 수'
            />
          )}
        </div>
        <Button disabled={!isEnableFormStatus} fill onClick={handleSaveClick}>
          저장
        </Button>
      </SC.Content>
    </BottomSheet>
  );
};

const SC = {
  Content: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 1.6rem;
    gap: 2rem;

    .input-group {
      width: 100%;
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
  `,
};