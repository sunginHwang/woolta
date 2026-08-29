import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { FC } from 'react';

interface Props {
  // 이달의 지출 금액
  amount: number;
}

const styles = stylex.create({
  regularAmountInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    marginRight: 0,
    marginBottom: '2rem',
    marginLeft: 0,
    paddingBlock: '1.5rem',
    paddingInline: '1.5rem',
    borderRadius: '1.8rem',
    backgroundColor: colorVars['--color-gray150'],
  },
  bold: {
    fontWeight: 600,
  },
});

/**
 * 정기 지출 리스트 -> 이달의 지출 금액 정보
 * @component
 */
const RegularAmountInfo: FC<Props> = ({ amount }) => {
  return (
    <div {...stylex.props(styles.regularAmountInfo)}>
      <Text variant='title4Bold' color='graySecondary'>
        이달의 정기 지출
      </Text>
      <Text variant='body3' color='red500'>
        <b {...stylex.props(styles.bold)}>{amount.toLocaleString('ko-KR')}</b> 원
      </Text>
    </div>
  );
};

export default RegularAmountInfo;
