import styled from '@emotion/styled';
import dayjs, { Dayjs } from 'dayjs';
import { FC, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import BotttomSheet from '..';
import { calendarStyle } from './style';
import TimePicker from './TimePicker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onChangeDateTime: (dateTime: Date) => void;
  date: Dayjs;
}

type modalPhase = 'date' | 'time';

/**
 * 날짜 + 시간 선택 모달
 * @component
 */

const DateTimeSheet: FC<Props> = ({ date, visible, onChangeDateTime, onClose }) => {
  const [dateTime, setDateTime] = useState<Dayjs>(date);
  const [modalPhase, setModalPhase] = useState<modalPhase>('date');

  useEffect(() => {
    setModalPhase('date');
  }, [visible]);

  // 날짜 선택 후 time 피커 활성화
  const onChangeCalendar = (changeDate: Value) => {
    setDateTime(dayjs(String(changeDate)).hour(dateTime.hour()).minute(dateTime.minute()));
    setModalPhase('time');
  };

  // 시간까지 선택하면 모달 종료
  const onChangeTime = (time: string) => {
    onChangeDateTime(new Date(`${dayjs(dateTime).format('YYYY-MM-DD')} ${time}`));
    onClose();
  };

  const time = dateTime.format('HH:MM');
  const isDatePhase = modalPhase === 'date';

  return (
    <BotttomSheet visible={visible} title='시간 선택' oncloseModal={onClose}>
      {isDatePhase && (
        <SC.Wrapper>
          <Calendar value={date.toDate()} showFixedNumberOfWeeks onChange={onChangeCalendar} />
        </SC.Wrapper>
      )}
      {!isDatePhase && <TimePicker time={time} onChangeTime={onChangeTime} />}
    </BotttomSheet>
  );
};

export default DateTimeSheet;
const SC = {
  Wrapper: styled.div`
    ${calendarStyle}
  `,
};
