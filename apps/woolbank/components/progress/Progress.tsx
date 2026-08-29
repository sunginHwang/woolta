import * as stylex from '@stylexjs/stylex';
import { gray500 } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

interface Props {
  percent: number;
  color: string;
  label: string | number;
  labelSuffix?: string;
  labelPrefix?: string;
  startMessage?: string;
  endMessage?: string;
  messageColor?: string;
}

/**
 * 공통 - 프로그레스 영역
 * @component
 */

export const Progress = ({
  percent,
  color,
  label,
  labelPrefix = '',
  labelSuffix = '',
  startMessage = '',
  endMessage = '',
  messageColor = gray500,
}: Props) => {
  return (
    <div {...stylex.props(styles.progressWrapper)}>
      <span {...stylex.props(styles.label, dynamicStyles.labelLeft(percent))}>
        {labelPrefix}
        {label}
        {labelSuffix}
      </span>
      <div {...stylex.props(styles.progress)}>
        <div {...stylex.props(styles.bar, dynamicStyles.barWidth(percent), dynamicStyles.barColor(color))} />
      </div>
      <div {...stylex.props(styles.info)}>
        <span {...stylex.props(styles.infoText, dynamicStyles.infoColor(messageColor))}>{startMessage}</span>
        <span {...stylex.props(styles.infoText, dynamicStyles.infoColor(messageColor))}>{endMessage}</span>
      </div>
    </div>
  );
};

const dynamicStyles = stylex.create({
  labelLeft: (percent: number) => ({ left: `${percent}%` }),
  barWidth: (percent: number) => ({ width: `${percent}%` }),
  barColor: (color: string) => ({ backgroundColor: color }),
  infoColor: (color: string) => ({ color }),
});

const styles = stylex.create({
  progressWrapper: {
    width: '100%',
  },
  label: {
    width: '5rem',
    maxWidth: '6rem',
    height: '3rem',
    top: '-1.2rem',
    lineHeight: '3rem',
    textAlign: 'center',
    background: colorVars['--color-red500'],
    color: colorVars['--color-white'],
    fontSize: '1.4rem',
    display: 'block',
    position: 'relative',
    transform: 'translate(-50%, 0)',
    borderRadius: '2.3rem',
    '::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      borderTopWidth: '0.5rem',
      borderTopStyle: 'solid',
      borderTopColor: colorVars['--color-red500'],
      borderLeftWidth: '0.5rem',
      borderLeftStyle: 'solid',
      borderLeftColor: 'transparent',
      borderRightWidth: '0.5rem',
      borderRightStyle: 'solid',
      borderRightColor: 'transparent',
      top: '100%',
      left: '50%',
      marginLeft: '-0.5rem',
      marginTop: '-0.1rem',
    },
  },
  progress: {
    height: '0.5rem',
    width: '100%',
    backgroundColor: colorVars['--color-gray600'],
    borderRadius: '1.2rem',
  },
  bar: {
    height: '0.5rem',
    borderRadius: '1.2rem',
  },
  info: {
    display: 'flex',
    width: '100%',
    marginTop: '0.5rem',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: '1.2rem',
  },
});
