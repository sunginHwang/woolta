'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback } from 'react';
import { IconChevronLeft } from '../../icons';
import { layout } from '../../style/layout';

interface Props {
  title: string;
  iconColor?: string;
  useBackButton?: boolean;
  onBackClick?: () => void;
  right?: React.ReactNode | string;
  useSkeleton?: boolean;
  position?: 'sticky' | 'fixed';
}

const dynamicStyles = stylex.create({
  headerPosition: (position: string) => ({
    position: position as 'sticky' | 'fixed',
  }),
  iconFill: (color: string) => ({ color }),
});

/**
 * 페이지 서브 헤더
 * @component
 */
const SubHeader: FC<Props> = ({
  title,
  iconColor,
  position = 'sticky',
  useSkeleton = false,
  useBackButton = true,
  onBackClick,
  right,
}) => {
  const { back } = useRouter();

  const handleBackClick = useCallback(() => {
    back();
    onBackClick?.();
  }, [back, onBackClick]);

  const resolvedIconColor = iconColor ?? colorVars['--color-pinkPrimary'];

  return (
    <header {...stylex.props(styles.header, dynamicStyles.headerPosition(position))}>
      <div {...stylex.props(styles.inner, !useSkeleton && styles.innerFilled)}>
        {useBackButton && (
          <div {...stylex.props(styles.side, styles.sideStart)} onClick={handleBackClick}>
            <IconChevronLeft width={26} height={26} fill={resolvedIconColor} />
          </div>
        )}
        <Text variant='title4Bold' xstyle={styles.titleText} color='black' data-cy='title' as='p' alignment='center'>
          {title}
        </Text>
        <div {...stylex.props(styles.side, styles.sideEnd)}>{right}</div>
      </div>
    </header>
  );
};

const styles = stylex.create({
  header: {
    left: 0,
    top: 0,
    width: '100%',
    zIndex: zIndexConsts.header,
  },
  inner: {
    paddingLeft: '1.6rem',
    paddingRight: '1.6rem',
    height: layout.headerHeight,
    display: 'flex',
    alignItems: 'center',
  },
  innerFilled: {
    backgroundColor: colorVars['--color-white'],
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: '#dcdce9',
  },
  side: {
    width: '100%',
    flex: '1 1 0%',
    display: 'flex',
    alignItems: 'center',
  },
  sideStart: {
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  sideEnd: {
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  titleText: {
    width: '100%',
    flex: '2 1 0%',
  },
});

export default SubHeader;
