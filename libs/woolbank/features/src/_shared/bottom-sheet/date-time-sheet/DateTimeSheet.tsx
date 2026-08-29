'use client';

import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { styled } from 'styled-components';
import type { CalendarValue } from '../calendarValue';
import { DefaultBottomSheet } from '../DefaultBottomSheet';
import { calendarStyle } from '../style';
import { TimePicker } from './TimePicker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onChangeDateTime: (dateTime: Date) => void;
  date: Dayjs;
}

type ModalPhase = 'date' | 'time';

/**
 * 날짜 + 시간 선택 모달
 * @component
 */
export const DateTimeSheet = ({ date, visible, onChangeDateTime, onClose }: Props) => {
  const [dateTime, setDateTime] = useState<Dayjs>(date);
  const [modalPhase, setModalPhase] = useState<ModalPhase>('date');

  useEffect(() => {
    setModalPhase('date');
  }, [visible]);

  const onChangeCalendar = (changeDate: CalendarValue) => {
    setDateTime(dayjs(String(changeDate)).hour(dateTime.hour()).minute(dateTime.minute()));
    setModalPhase('time');
  };

  const onChangeTime = (time: string) => {
    onChangeDateTime(new Date(`${dayjs(dateTime).format('YYYY-MM-DD')} ${time}`));
    onClose();
  };

  const time = dateTime.format('HH:MM');
  const isDatePhase = modalPhase === 'date';

  return (
    <DefaultBottomSheet visible={visible} title='시간 선택' oncloseModal={onClose}>
      {isDatePhase && (
        <SC.Wrapper>
          <Calendar value={date.toDate()} showFixedNumberOfWeeks onChange={onChangeCalendar} />
        </SC.Wrapper>
      )}
      {!isDatePhase && <TimePicker time={time} onChangeTime={onChangeTime} />}
    </DefaultBottomSheet>
  );
};

const SC = {
  Wrapper: styled.div`
    ${calendarStyle}
  `,
};
