import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { PropsWithChildren, ReactNode } from 'react';
import { layoutConsts } from '../../style/layout.stylex';
import SubHeader from './SubHeader';

interface Props extends PropsWithChildren {
  // 헤더 타이틀
  title: string | ReactNode;
  // 아이콘 색상
  iconColor?: string;
  // 뒤로가기 버튼 사용 우무
  useBackButton?: boolean;
  // 뒤로가기 클릭 이벤트
  onBackClick?: () => void;
  // 우측 영역 dom 추가
  right?: React.ReactNode | string;
  bgColor?: string;
}

/**
 * 페이지 헤더 영역
 * @component
 */
const _Header = ({ title, right, bgColor = '#FFFFFF' }: Props) => {
  const isTextTitle = typeof title === 'string';
  return (
    <header {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.inner, dynamicStyles.bgColor(bgColor))}>
        {isTextTitle && (
          <Text variant='title4Bold' color='grayPrimary' data-cy='title'>
            {title}
          </Text>
        )}
        {!isTextTitle && title}
        <div {...stylex.props(styles.rightHeader)}>{right}</div>
      </div>
    </header>
  );
};

const dynamicStyles = stylex.create({
  bgColor: (color: string) => ({ backgroundColor: color }),
});

const styles = stylex.create({
  container: {
    position: 'sticky',
    left: 0,
    top: 0,
    width: '100%',
    zIndex: zIndexConsts.header,
  },
  inner: {
    height: layoutConsts.headerHeight,
    paddingBlock: 0,
    paddingInline: '1.6rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightHeader: {
    paddingTop: '0.4rem',
    color: colorVars['--color-graySecondary'],
  },
});

export const Header = Object.assign(_Header, {
  Sub: SubHeader,
});
