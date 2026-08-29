import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

interface Props {
  income_amount?: number;
  expenditure_amount?: number;
}

const styles = stylex.create({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBlock: 0,
    paddingInline: '16px',
    height: '2rem',
    backgroundColor: colorVars['--color-gray150'],
    gap: '1rem',
  },
});

export const WeekInfo = ({ income_amount = 0, expenditure_amount = 0 }: Props) => {
  return (
    <div {...stylex.props(styles.container)}>
      {income_amount > 0 && (
        <Text variant='small1Medium' color='red500' as='p'>
          +{income_amount.toLocaleString('ko-KR')}원
        </Text>
      )}
      {expenditure_amount > 0 && (
        <Text variant='small1Medium' color='gray700' as='p'>
          -{expenditure_amount.toLocaleString('ko-KR')}원
        </Text>
      )}
    </div>
  );
};
