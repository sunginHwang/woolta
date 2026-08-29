import { useInputs, useToggle } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { Button } from '../../atom/Button';

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

export const TimePicker = ({ time, onChangeTime }: Props) => {
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
    <div {...stylex.props(styles.timePicker)}>
      <div {...stylex.props(styles.timePickerInner)}>
        <div {...stylex.props(styles.amPm)}>
          <span
            {...stylex.props(styles.amPmItem, styles.amPmItemFirst, isAm && styles.amPmItemActive)}
            onClick={() => toggleAm(true)}
          >
            오전
          </span>
          <span {...stylex.props(styles.amPmItem, !isAm && styles.amPmItemActive)} onClick={() => toggleAm(false)}>
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

const styles = stylex.create({
  amPmItem: {
    display: 'block',
    color: colorVars['--color-gray150'],
    fontWeight: 400,
    fontSize: '1.6rem',
  },
  amPmItemFirst: {
    marginBottom: '1.5rem',
  },
  amPmItemActive: {
    color: colorVars['--color-black'],
    fontWeight: 700,
    fontSize: '2rem',
  },
  timePicker: {
    paddingBlock: 0,
    paddingInline: '2rem',
  },
  timePickerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmArea: {
    marginBlock: '2rem',
    marginInline: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  validMsg: {
    marginTop: '2rem',
    marginBottom: '2rem',
    marginLeft: '5.5rem',
    marginRight: 0,
    fontSize: '1.4rem',
    color: colorVars['--color-orangePrimary'],
  },
  amPm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: '4rem',
  },
  timeSeparator: {
    fontSize: '3.6rem',
    marginBlock: '1rem',
    marginInline: 0,
    fontWeight: 'bold',
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
    borderBottomColor: colorVars['--color-gray200'],
    fontSize: '3.4rem',
    width: '8rem',
    textAlign: 'center',
    fontWeight: 'bold',
    color: colorVars['--color-black'],
  },
});
