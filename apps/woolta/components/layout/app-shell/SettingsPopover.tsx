'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { useAtomValue } from 'jotai';
import { FiMoon, FiSun } from 'react-icons/fi';
import { layoutConsts } from '../../../style/layouts.stylex';
import { railExpandedAtom, useThemeType } from '../store';

interface Props {
  onClose: () => void;
}

const styles = stylex.create({
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: zIndexConsts.layer,
  },
  popover: {
    position: 'fixed',
    left: `calc(${layoutConsts.railWidth} + 0.8rem)`,
    bottom: '1.2rem',
    zIndex: zIndexConsts.layer,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '22rem',
    padding: '1.6rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    boxShadow: '0 0.4rem 1.6rem rgba(0, 0, 0, 0.15)',
  },
  popoverRailExpanded: {
    left: `calc(${layoutConsts.railExpandedWidth} + 0.8rem)`,
  },
  optionRow: {
    display: 'flex',
    gap: '0.8rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    flex: 1,
    paddingBlock: '0.8rem',
    paddingInline: 0,
    borderRadius: '0.8rem',
    fontSize: '1.3rem',
    color: colorVars['--color-textSecondary'],
    backgroundColor: 'transparent',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
  },
  optionActive: {
    color: colorVars['--color-interactivePrimary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderColor: colorVars['--color-interactivePrimary'],
  },
});

const SettingsPopover = ({ onClose }: Props) => {
  const [themeType, setThemeType] = useThemeType();
  const isRailExpanded = useAtomValue(railExpandedAtom);

  return (
    <>
      <div {...stylex.props(styles.backdrop)} onClick={onClose} />
      <div {...stylex.props(styles.popover, isRailExpanded && styles.popoverRailExpanded)}>
        <Text as='p' variant='small1Bold' color='textSecondary'>
          테마
        </Text>
        <div {...stylex.props(styles.optionRow)}>
          <button
            type='button'
            onClick={() => setThemeType('light')}
            {...stylex.props(styles.option, themeType === 'light' && styles.optionActive)}
          >
            <FiSun size={16} />
            라이트
          </button>
          <button
            type='button'
            onClick={() => setThemeType('dark')}
            {...stylex.props(styles.option, themeType === 'dark' && styles.optionActive)}
          >
            <FiMoon size={16} />
            다크
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPopover;
