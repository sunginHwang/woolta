import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';
import { styled } from 'styled-components';
import Deem from '../../atom/Deem';
import { calendarStyle } from './style';

interface Props {
  visible: boolean;
  onclose: () => void;
  onDateChange: (date: string) => void;
  date: Date;
}

export const DateSheet = ({ date, visible, onDateChange, onclose }: Props) => {
  const handleCalendarChange = (date: Value) => {
    onDateChange(String(date));
  };

  return (
    <Deem visible={visible} onDeemClick={onclose}>
      <SC.DateModal $isActive={visible}>
        <Calendar
          value={date}
          showFixedNumberOfWeeks
          onChange={handleCalendarChange}
          next2Label={null}
          prev2Label={null}
        />
      </SC.DateModal>
    </Deem>
  );
};

const SC = {
  DateModal: styled.div<{
    $isActive: boolean;
  }>`
    ${calendarStyle};
    position: fixed;
    bottom: ${({ $isActive }) => ($isActive ? '0' : '-30rem')};
    width: 100%;
    transition: all 0.3s ease;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.white};
    z-index: ${({ theme }) => theme.zIndex.modalDeem + 1};
    box-shadow: 0.1rem 0.3rem 1rem 0.2rem rgba(0, 0, 0, 0.2);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    p {
      height: 15rem;
    }
  `,
};
