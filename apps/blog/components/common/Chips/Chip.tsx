import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

type ChipVarient = 'filled' | 'outlined' | 'event';
type ChipColor = 'primary';
type ChipSize = 'small' | 'medium';

export interface ChipItem<T = string> {
  name: string;
  value: T;
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  varient?: ChipVarient;
  color?: ChipColor;
  size?: ChipSize;
  disabled?: boolean;
  start_icon?: ReactNode;
  end_icon?: ReactNode;
  onClick?: () => void;
  text?: string;
}

const EVENT_GRADIENT =
  'linear-gradient(0deg, white, white) padding-box, linear-gradient(115.62deg, #e62f71 6.59%, #ff6d1c 45.24%, #e62fb3 88.05%) border-box';

const styles = stylex.create({
  base: {
    borderRadius: '18px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    verticalAlign: 'middle',
  },
  enabled: {
    cursor: 'pointer',
    opacity: 1,
  },
  disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  sizeSmall: {
    paddingTop: '7px',
    paddingBottom: '6px',
    paddingInline: '12px',
    height: '32px',
  },
  sizeMedium: {
    paddingTop: '9px',
    paddingBottom: '8px',
    paddingInline: '12px',
    height: '36px',
  },
  filledDefault: {
    backgroundColor: colorVars['--color-bgPrimary'],
    color: colorVars['--color-graySecondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
  },
  filledActive: {
    backgroundColor: colorVars['--color-grayActive'],
    color: colorVars['--color-white'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-grayActive'],
  },
  outlinedDefault: {
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-graySecondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border3'],
  },
  outlinedActive: {
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-grayActive'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-grayActive'],
  },
  eventVariant: {
    background: {
      default: EVENT_GRADIENT,
      ':active': EVENT_GRADIENT,
    },
    color: colorVars['--color-pinkPrimary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    boxShadow: '0px 2px 4px 0px #e62f7126',
  },
  iconStart: {
    marginRight: '4px',
    pointerEvents: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  iconEnd: {
    marginLeft: '4px',
    pointerEvents: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
});

const sizeStyleMap: Record<ChipSize, stylex.StyleXStyles> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
};

function getColorStyle(varient: ChipVarient, active: boolean): stylex.StyleXStyles | null {
  if (varient === 'event') return styles.eventVariant;
  if (varient === 'filled') return active ? styles.filledActive : styles.filledDefault;
  if (varient === 'outlined') return active ? styles.outlinedActive : styles.outlinedDefault;
  return null;
}

const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      disabled = false,
      className,
      text,
      active = false,
      size = 'small',
      varient = 'filled',
      color: _color = 'primary',
      start_icon,
      end_icon,
      ...props
    },
    ref,
  ) => {
    const colorStyle = getColorStyle(varient, active);
    const sx = stylex.props(
      typographyStyles.body4Medium,
      styles.base,
      disabled ? styles.disabled : styles.enabled,
      sizeStyleMap[size],
      colorStyle,
    );

    return (
      <button
        ref={ref}
        {...sx}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
        {...props}
      >
        {start_icon && <span {...stylex.props(styles.iconStart)}>{start_icon}</span>}
        {text}
        {end_icon && <span {...stylex.props(styles.iconEnd)}>{end_icon}</span>}
      </button>
    );
  },
);

export default Chip;
