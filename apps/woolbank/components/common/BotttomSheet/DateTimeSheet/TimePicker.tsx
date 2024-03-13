import { useInputs, useToggle } from '@common';
import { styled } from 'styled-components';
import { FC } from 'react';
import { Button } from '../../../../components/atom/Button';

// 12시간
const HALF_DAY_HOUR = 12;

interface Props {
  time: string;
  onChangeTime: (time: string) => void;
}

/**
 * time 피커
 * @component
 */

const TimePicker: FC<Props> = ({ time, onChangeTime }) => {
  const HH_MM = time.split(':');
  const { inputs, onChange } = useInputs({ hours: '', minutes: '' });
  const [isValidTime, toggleValidTime] = useToggle(true);
  const [isAm, toggleAm] = useToggle(Number(HH_MM[0]) <= HALF_DAY_HOUR);

  const onConfirmClick = () => {
    // input 에 시간 or 분이 없으면 props 의 시간을 반환 처리
    const hour = Number(inputs.hours || hours24);
    const minutes = Number(inputs.minutes || Number(HH_MM[1]));
    // 24:00 이 마지막 시각
    const isOver24 = !isAm && hour === 12 && minutes > 0;
    const isValid = hour > 0 && hour <= HALF_DAY_HOUR && minutes < 61 && !isOver24;

    if (isValid) {
      onChangeTime(
        `${String(isAm ? hour : hour + HALF_DAY_HOUR).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      );
    } else {
      toggleValidTime(false);
    }
  };

  const hours24 = String(Number(HH_MM[0]) > HALF_DAY_HOUR ? Number(HH_MM[0]) - HALF_DAY_HOUR : HH_MM[0]);

  return (
    <SC.TimePicker>
      <div>
        <SC.AmPm>
          <SC.AmPmItem $isActive={isAm} onClick={() => toggleAm(true)}>
            오전
          </SC.AmPmItem>
          <SC.AmPmItem $isActive={!isAm} onClick={() => toggleAm(false)}>
            오후
          </SC.AmPmItem>
        </SC.AmPm>
        <SC.Time>
          <SC.TimeInput
            type='number'
            name='hours'
            placeholder={hours24}
            maxLength={2}
            value={inputs.hours}
            onChange={onChange}
          />
          <SC.TimeSeparator>:</SC.TimeSeparator>
          <SC.TimeInput
            type='number'
            name='minutes'
            placeholder={HH_MM[1]}
            maxLength={2}
            value={inputs.minutes}
            onChange={onChange}
          />
        </SC.Time>
      </div>
      {!isValidTime && <SC.ValidMsg>올바른 시간을 입력해 주세요.</SC.ValidMsg>}
      <SC.ConfirmArea>
        <Button size='small' onClick={onConfirmClick}>
          확인
        </Button>
      </SC.ConfirmArea>
    </SC.TimePicker>
  );
};

const SC = {
  AmPmItem: styled.span<{ $isActive: boolean }>`
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.black : theme.colors.gray150)};
    font-weight: ${({ $isActive }) => ($isActive ? 700 : 400)};
    font-size: ${({ $isActive }) => ($isActive ? '2rem' : '1.6rem')};
  `,
  TimePicker: styled.div`
    padding: 0 2rem;

    > div:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
  ConfirmArea: styled.div`
    margin: 2rem 0;
    display: flex;
    justify-content: flex-end;
  `,
  ValidMsg: styled.div`
    margin: 2rem 0 2rem 5.5rem;
    font-size: 1.4rem;
    color: ${({ theme }) => theme.colors.orangePrimary};
  `,
  AmPm: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 4rem;

    span {
      display: block;

      :first-child {
        margin-bottom: 1.5rem;
      }
    }
  `,
  TimeSeparator: styled.span`
    font-size: 3.6rem;
    margin: 1rem 0;
    font-weight: bold;
  `,
  Time: styled.div`
    display: flex;
    flex-direction: row;
    margin-right: 2rem;
  `,
  TimeInput: styled.input`
    border: none;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray200};
    font-size: 3.4rem;
    width: 8rem;
    text-align: center;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.black};

    input + input {
      margin: 1rem 0;
    }
  `,
};

export default TimePicker;
