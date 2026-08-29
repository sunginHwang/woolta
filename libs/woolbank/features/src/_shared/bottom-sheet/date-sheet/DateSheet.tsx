'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import Calendar from 'react-calendar';
import Deem from '../../components/deem/Deem';
import calendarCss from '../calendar.module.css';
import type { CalendarValue } from '../calendarValue';

interface Props {
  visible: boolean;
  onclose: () => void;
  onDateChange: (date: string) => void;
  date: Date;
}

const styles = stylex.create({
  dateModal: {
    position: 'fixed',
    width: '100%',
    transition: 'all 0.3s ease',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    textAlign: 'center',
    backgroundColor: colorVars['--color-bgSurface'],
    // zIndexConsts.modalDeem(500) + 1 — defineConsts 는 문자열이라 산술이 불가해 직접 적는다
    zIndex: 501,
    boxShadow: '0.1rem 0.3rem 1rem 0.2rem rgba(0, 0, 0, 0.2)',
    // 원본은 constant()/env() 두 줄 폴백이었으나 StyleX 는 중복 선언을 표현할 수 없다
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  active: { bottom: 0 },
  inactive: { bottom: '-30rem' },
});

export const DateSheet = ({ date, visible, onDateChange, onclose }: Props) => {
  const handleCalendarChange = (date: CalendarValue) => {
    onDateChange(String(date));
  };

  const sx = stylex.props(styles.dateModal, visible ? styles.active : styles.inactive);

  return (
    <Deem visible={visible} onDeemClick={onclose}>
      <div {...sx} className={`${sx.className ?? ''} ${calendarCss.calendar} ${calendarCss.dateModal}`}>
        <Calendar
          value={date}
          showFixedNumberOfWeeks
          onChange={handleCalendarChange}
          next2Label={null}
          prev2Label={null}
        />
      </div>
    </Deem>
  );
};
