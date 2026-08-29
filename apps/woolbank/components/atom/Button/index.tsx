import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonVariant = 'primary' | 'tertiaryColor' | 'tertiaryGray' | 'secondaryGray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 전체 영역 버튼 유무를 정의합니다.
   * @default false
   */
  fill?: boolean;
  /**
   * 버튼 variant 를 선택합니다.
   * @default primary
   */
  variant?: ButtonVariant;
  /**
   * 버튼 크기를 정의합니다.
   * @default medium
   */
  size?: ButtonSize;
  /**
   * 버튼 텍스트 좌측의 아이콘을 넣을 수 있습니다.
   */
  startIcon?: ReactNode;
  /**
   * 버튼 텍스트 우측의 아이콘을 넣을 수 있습니다.
   */
  endIcon?: ReactNode;
  /**
   * 버튼에서 로딩 프로그레스 바를 보여줍니다.
   * @default false
   */
  loading?: boolean;
  /**
   * 버튼 비활성화 유무를 정의합니다.
   * @default false
   */
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'medium',
      variant = 'primary',
      fill,
      disabled,
      loading,
      className,
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const sizeStyleMap = {
      large: styles.sizeLarge,
      medium: styles.sizeMedium,
      small: styles.sizeSmall,
    } as const;

    const sizeTypographyMap = {
      large: typographyStyles.title4Medium,
      medium: typographyStyles.title5Medium,
      small: typographyStyles.body4Medium,
    } as const;

    const variantStyleMap = {
      primary: styles.variantPrimary,
      tertiaryColor: styles.variantTertiaryColor,
      tertiaryGray: styles.variantTertiaryGray,
      secondaryGray: styles.variantSecondaryGray,
    } as const;

    const sxProps = stylex.props(
      styles.base,
      fill && styles.baseFull,
      sizeStyleMap[size],
      sizeTypographyMap[size],
      variantStyleMap[variant],
    );

    return (
      <div {...stylex.props(styles.wrapper, fill && styles.wrapperFull)}>
        <button
          disabled={disabled}
          ref={ref}
          {...props}
          className={[sxProps.className, className].filter(Boolean).join(' ')}
          style={sxProps.style}
        >
          {!loading && (
            <>
              {startIcon && <span {...stylex.props(styles.iconSlot)}>{startIcon}</span>}
              {children}
              {endIcon && <span {...stylex.props(styles.iconSlot)}>{endIcon}</span>}
            </>
          )}
          {loading && (
            <div {...stylex.props(styles.loading)}>
              <ClipLoader color='#FFFFFF' size={20} />
            </div>
          )}
        </button>
      </div>
    );
  },
);

const styles = stylex.create({
  wrapper: {},
  wrapperFull: {
    width: '100%',
  },
  base: {
    borderRadius: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    verticalAlign: 'middle',
    ':active': {
      opacity: 0.7,
    },
  },
  baseFull: {
    width: '100%',
  },
  iconSlot: {
    display: 'inline-flex',
    marginInline: '4px',
  },
  sizeLarge: {
    minWidth: '47px',
    height: '52px',
    paddingBlock: 0,
    paddingInline: '24px',
  },
  sizeMedium: {
    minWidth: '58px',
    height: '42px',
    paddingBlock: 0,
    paddingInline: '16px',
  },
  sizeSmall: {
    minWidth: '63px',
    height: '36px',
    paddingBlock: 0,
    paddingInline: '12px',
  },
  variantPrimary: {
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-orangePrimary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-orangePrimary'],
    opacity: {
      default: 1,
      ':disabled': 0.3,
    },
  },
  variantTertiaryColor: {
    color: colorVars['--color-orangePrimary'],
    backgroundColor: colorVars['--color-white'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-orangePrimary'],
  },
  variantTertiaryGray: {
    color: colorVars['--color-gray600'],
    backgroundColor: colorVars['--color-white'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border2'],
  },
  variantSecondaryGray: {
    color: colorVars['--color-graySecondary'],
    backgroundColor: colorVars['--color-bgSecondary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-bgSecondary'],
    ':hover': {
      backgroundColor: colorVars['--color-gray100'],
    },
  },
  loading: {
    position: 'absolute',
    visibility: 'visible',
    display: 'flex',
    left: '50%',
    transform: 'translate(-50%)',
    width: '40px',
  },
});
