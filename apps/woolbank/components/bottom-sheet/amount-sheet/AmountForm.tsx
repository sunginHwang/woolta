import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { MouseEvent, FC } from 'react';
import { vibrate } from '../../../utils/browsers/vibrate';
import { Button } from '../../atom/Button';

const VIBRATION_PATTERN = 10;
interface Props {
  visible?: boolean;
  useCompleteBtn?: boolean;
  showInitBtn?: boolean;
  isZeroAmount: boolean;
  onNumberClick: (e: MouseEvent<HTMLTableDataCellElement>) => void;
  onBackNumberClick: () => void;
  // 우측 최 하단 클릭
  onRightBottomClick: () => void;
}

const AmountForm: FC<Props> = ({
  useCompleteBtn = false,
  isZeroAmount,
  onNumberClick,
  onRightBottomClick,
  onBackNumberClick,
}) => {
  const handleNumberClick = (e: MouseEvent<HTMLTableDataCellElement>) => {
    vibrate(VIBRATION_PATTERN);
    onNumberClick(e);
  };

  const handleBackNumberClick = () => {
    vibrate(VIBRATION_PATTERN);
    onBackNumberClick();
  };

  const handleRightBottomClick = () => {
    vibrate(VIBRATION_PATTERN);
    onRightBottomClick();
  };

  return (
    <div {...stylex.props(styles.input)}>
      <table {...stylex.props(styles.inputTable)}>
        <tbody>
          <tr>
            <td data-cy='number_1' data-number={1} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              1
            </td>
            <td data-cy='number_2' data-number={2} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              2
            </td>
            <td data-cy='number_3' data-number={3} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              3
            </td>
          </tr>
          <tr>
            <td data-cy='number_4' data-number={4} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              4
            </td>
            <td data-cy='number_5' data-number={5} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              5
            </td>
            <td data-cy='number_6' data-number={6} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              6
            </td>
          </tr>
          <tr>
            <td data-cy='number_7' data-number={7} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              7
            </td>
            <td data-cy='number_8' data-number={8} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              8
            </td>
            <td data-cy='number_9' data-number={9} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              9
            </td>
          </tr>
          <tr>
            <td data-cy='numberBack' onClick={handleBackNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              {!isZeroAmount && '←'}
            </td>
            <td data-cy='number_0' data-number={0} onClick={handleNumberClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
              0
            </td>
            {useCompleteBtn && (
              <td
                data-cy='numberComplete'
                onClick={handleRightBottomClick}
                {...stylex.props(typographyStyles.title3Medium, styles.inputTd, styles.inputTdSmall)}
              >
                {!isZeroAmount && (
                  <div {...stylex.props(styles.saveButton)}>
                    <Button fill>확인</Button>
                  </div>
                )}
              </td>
            )}
            {!useCompleteBtn && (
              <td data-cy='numberX' onClick={handleRightBottomClick} {...stylex.props(typographyStyles.title3Medium, styles.inputTd)}>
                {!isZeroAmount && 'x'}
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AmountForm;

const styles = stylex.create({
  saveButton: {
    paddingBlock: 0,
    paddingInline: '2rem',
    marginTop: '-4px',
    marginBottom: '-4px',
  },
  input: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  inputTable: {
    width: '100%',
    textAlign: 'center',
    flex: 1,
    color: colorVars['--color-black'],
    height: '83%',
  },
  inputTd: {
    width: '33.33333%',
    paddingBlock: '1rem',
    paddingInline: 0,
    ':active': {
      borderRadius: '1.6rem',
      backgroundColor: colorVars['--color-gray150'],
    },
  },
  inputTdSmall: {
    paddingBlock: '0.3rem',
    paddingInline: 0,
  },
});
