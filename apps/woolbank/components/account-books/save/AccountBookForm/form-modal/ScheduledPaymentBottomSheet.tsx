import { Button } from 'apps/woolbank/components/atom/Button';
import BaseInput from 'apps/woolbank/components/common/BaseInput';
import BotttomSheet from 'apps/woolbank/components/common/BotttomSheet';
import ToggleTab from 'apps/woolbank/components/common/ToggleTab';
import { isNumber } from 'lodash-es';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ScheduledPaymentType } from '../hooks/useAccountBookForm';

const TAB_LIST = [
  {
    type: 'repeat',
    name: '반복',
  },
  {
    type: 'installment',
    name: '할부',
  },
];

const VALUE_INFO_MAPPER: Record<
  ScheduledPaymentType,
  {
    label: string;
    placeholder: string;
  }
> = {
  repeat: {
    label: '매월 지출일',
    placeholder: '매 월 지출되는 일자를 입력해주세요.',
  },
  installment: {
    label: '할부 개월 수',
    placeholder: '할부 개월 수를 입력해주세요.',
  },
};
interface Props {
  is_open?: boolean;
  scheduled_payments_value?: number;
  scheduled_payments_type?: ScheduledPaymentType;
  setSaveScheduledPayments?: (props: {
    scheduled_payments_value: number;
    scheduled_payments_type: ScheduledPaymentType;
  }) => void;
  onCloseModal?: () => void;
}
export const ScheduledPaymentBottomSheet: FC<Props> = ({
  is_open,
  scheduled_payments_value,
  scheduled_payments_type,
  setSaveScheduledPayments,
  onCloseModal,
}) => {
  const [scheduled_payments_type_state, setScheduledPaymentsTypeState] = useState<ScheduledPaymentType>('repeat');
  const [schedule_payment_value_state, setSchedulePaymentValue] = useState<'' | number>('');

  useEffect(() => {
    if (scheduled_payments_value) {
      setSchedulePaymentValue(scheduled_payments_value);
    }
  }, [scheduled_payments_value, setScheduledPaymentsTypeState]);

  useEffect(() => {
    if (scheduled_payments_type) {
      setScheduledPaymentsTypeState(scheduled_payments_type);
    }
  }, [scheduled_payments_type, setSchedulePaymentValue]);

  const handleSchedulePaymentValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isNumber = !isNaN(Number(e.target.value));

    if (isNumber) {
      setSchedulePaymentValue(Number(e.target.value));
    }
  };

  const handleSaveClick = () => {
    if (schedule_payment_value_state && is_enable_form_status) {
      setSaveScheduledPayments?.({
        scheduled_payments_value: schedule_payment_value_state,
        scheduled_payments_type: scheduled_payments_type_state,
      });
    }
  };

  const { placeholder, label } = VALUE_INFO_MAPPER[scheduled_payments_type_state];
  const is_valid_installment =
    scheduled_payments_type_state === 'installment' &&
    !!schedule_payment_value_state &&
    schedule_payment_value_state > 0;
  const is_valid_repeat =
    scheduled_payments_type_state === 'repeat' &&
    !!schedule_payment_value_state &&
    schedule_payment_value_state > 0 &&
    schedule_payment_value_state <= 31;

  const is_enable_form_status = is_valid_installment || is_valid_repeat;

  return (
    <BotttomSheet visible={is_open} oncloseModal={onCloseModal} title='반복/할부'>
      <SC.Content>
        <ToggleTab
          tabs={TAB_LIST}
          value={scheduled_payments_type_state}
          onChangeTab={(tab) => {
            setSchedulePaymentValue('');
            setScheduledPaymentsTypeState(tab.type as ScheduledPaymentType);
          }}
        />
        <div className='input-group'>
          <BaseInput
            type='number'
            onChange={handleSchedulePaymentValueChange}
            value={schedule_payment_value_state}
            placeholder={placeholder}
            isShowCloseBtn={false}
            label={label}
          />
        </div>
        <Button disabled={!is_enable_form_status} fill onClick={handleSaveClick}>
          저장
        </Button>
      </SC.Content>
    </BotttomSheet>
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
    }
  `,
};
