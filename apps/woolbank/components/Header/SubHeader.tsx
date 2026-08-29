import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback } from 'react';
import { layoutConsts } from '../../style/layout.stylex';
import { IconChevronLeft } from '../atom/Icon';

interface Props {
  // 헤더 타이틀
  title: string;
  // 아이콘 색상
  iconColor?: string;
  // 뒤로가기 버튼 사용 우무
  useBackButton?: boolean;
  // 뒤로가기 클릭 이벤트
  onBackClick?: () => void;
  // 우측 영역 dom 추가
  right?: React.ReactNode | string;
  // skeleton 모드 사용 유무
  useSkeleton?: boolean;
  position?: 'sticky' | 'fixed';
}

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

  return (
    <header {...stylex.props(styles.headerWithBack, position === 'fixed' ? styles.positionFixed : styles.positionSticky)}>
      <div {...stylex.props(styles.inner, useSkeleton && styles.innerSkeleton)}>
        {useBackButton && (
          <div {...stylex.props(styles.sideLeft)} onClick={handleBackClick}>
            <IconChevronLeft width={26} height={26} fill={iconColor ?? '#E62F71'} />
          </div>
        )}
        <Text variant='title4Bold' color='black' data-cy='title' as='p' alignment='center' xstyle={styles.title}>
          {title}
        </Text>
        <div {...stylex.props(styles.sideRight)}>{right}</div>
      </div>
    </header>
  );
};

const styles = stylex.create({
  headerWithBack: {
    left: 0,
    top: 0,
    width: '100%',
    zIndex: zIndexConsts.header,
  },
  positionSticky: {
    position: 'sticky',
  },
  positionFixed: {
    position: 'fixed',
  },
  inner: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
    backgroundColor: colorVars['--color-white'],
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: '#dcdce9',
    height: layoutConsts.headerHeight,
    display: 'flex',
    alignItems: 'center',
  },
  innerSkeleton: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    borderBottomStyle: 'none',
  },
  sideLeft: {
    width: '100%',
    flex: '1 1 0%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  sideRight: {
    width: '100%',
    flex: '1 1 0%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },
  title: {
    width: '100%',
    flex: '2 1 0%',
  },
});

export default SubHeader;
