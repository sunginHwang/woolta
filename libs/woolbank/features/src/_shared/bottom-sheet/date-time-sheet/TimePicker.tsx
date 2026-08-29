'use client';

import { useInputs, useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { Button } from '../../components/button/Button';

const HALF_DAY_HOUR = 12;

interface Props {
  time: string;
  onChangeTime: (time: string) => void;
}

/**
 * time 피커
 * @component
 */
export const TimePicker = ({ time, onChangeTime }: Props) => {
  const HH_MM = time.split(':');
  const { inputs, onChange } = useInputs({ hours: '', minutes: '' });
  const [isValidTime, toggleValidTime] = useToggle(true);
  const [isAm, toggleAm] = useToggle(Number(HH_MM[0]) <= HALF_DAY_HOUR);

  const onConfirmClick = () => {
    const hour = Number(inputs.hours || hours24);
    const minutes = Number(inputs.minutes || Number(HH_MM[1]));
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
    <div {...stylex.props(styles.timePicker)}>
      <div {...stylex.props(styles.row)}>
        <div {...stylex.props(styles.amPm)}>
          <span {...stylex.props(styles.amPmItem, dynamicStyles.amPmActive(isAm))} onClick={() => toggleAm(true)}>
            오전
          </span>
          <span {...stylex.props(styles.amPmItem, dynamicStyles.amPmActive(!isAm))} onClick={() => toggleAm(false)}>
            오후
          </span>
        </div>
        <div {...stylex.props(styles.time)}>
          <input
            {...stylex.props(styles.timeInput)}
            type='number'
            name='hours'
            placeholder={hours24}
            maxLength={2}
            value={inputs.hours}
            onChange={onChange}
          />
          <span {...stylex.props(styles.timeSeparator)}>:</span>
          <input
            {...stylex.props(styles.timeInput)}
            type='number'
            name='minutes'
            placeholder={HH_MM[1]}
            maxLength={2}
            value={inputs.minutes}
            onChange={onChange}
          />
        </div>
      </div>
      {!isValidTime && <div {...stylex.props(styles.validMsg)}>올바른 시간을 입력해 주세요.</div>}
      <div {...stylex.props(styles.confirmArea)}>
        <Button size='small' onClick={onConfirmClick}>
          확인
        </Button>
      </div>
    </div>
  );
};

const dynamicStyles = stylex.create({
  amPmActive: (isActive: boolean) => ({
    color: isActive ? colorVars['--color-textPrimary'] : colorVars['--color-textDisabled'],
    fontWeight: isActive ? 700 : 400,
    fontSize: isActive ? '2rem' : '1.6rem',
  }),
});

const styles = stylex.create({
  timePicker: {
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amPm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '4rem',
  },
  amPmItem: {
    display: 'block',
  },
  time: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '2rem',
  },
  timeInput: {
    borderWidth: 0,
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    fontSize: '3.4rem',
    width: '8rem',
    textAlign: 'center',
    fontWeight: 'bold',
    color: colorVars['--color-textPrimary'],
  },
  timeSeparator: {
    fontSize: '3.6rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  validMsg: {
    marginTop: '2rem',
    marginBottom: '2rem',
    marginLeft: '5.5rem',
    fontSize: '1.4rem',
    color: colorVars['--color-orangePrimary'],
  },
  confirmArea: {
    marginTop: '2rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
