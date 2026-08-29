'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { MouseEvent, FC } from 'react';
import { Button } from '../../components/button/Button';
import { vibrate } from '../../utils/browsers/vibrate';

const VIBRATION_PATTERN = 10;

interface Props {
  visible?: boolean;
  useCompleteBtn?: boolean;
  showInitBtn?: boolean;
  isZeroAmount: boolean;
  onNumberClick: (e: MouseEvent<HTMLTableDataCellElement>) => void;
  onBackNumberClick: () => void;
  onRightBottomClick: () => void;
}

const dynamicStyles = stylex.create({
  tdPadding: (isSmall: boolean) => ({
    paddingTop: isSmall ? '.3rem' : '1rem',
    paddingBottom: isSmall ? '.3rem' : '1rem',
  }),
  tdActiveBg: (isHide: boolean) => ({
    backgroundColor: {
      default: null,
      ':active': isHide ? colorVars['--color-bgSurface'] : colorVars['--color-bgSurfaceSecondary'],
    },
    borderRadius: {
      default: null,
      ':active': '1.6rem',
    },
  }),
});

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
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_1' data-number={1} onClick={handleNumberClick}>1</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_2' data-number={2} onClick={handleNumberClick}>2</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_3' data-number={3} onClick={handleNumberClick}>3</td>
          </tr>
          <tr>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_4' data-number={4} onClick={handleNumberClick}>4</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_5' data-number={5} onClick={handleNumberClick}>5</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_6' data-number={6} onClick={handleNumberClick}>6</td>
          </tr>
          <tr>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_7' data-number={7} onClick={handleNumberClick}>7</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_8' data-number={8} onClick={handleNumberClick}>8</td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_9' data-number={9} onClick={handleNumberClick}>9</td>
          </tr>
          <tr>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(isZeroAmount))} data-cy='numberBack' onClick={handleBackNumberClick}>
              {!isZeroAmount && '←'}
            </td>
            <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(false))} data-cy='number_0' data-number={0} onClick={handleNumberClick}>0</td>
            {useCompleteBtn && (
              <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(true), dynamicStyles.tdActiveBg(isZeroAmount))} data-cy='numberComplete' onClick={handleRightBottomClick}>
                {!isZeroAmount && (
                  <div {...stylex.props(styles.saveButton)}>
                    <Button fill>확인</Button>
                  </div>
                )}
              </td>
            )}
            {!useCompleteBtn && (
              <td {...stylex.props(typographyStyles.title3Medium, styles.inputTd, dynamicStyles.tdPadding(false), dynamicStyles.tdActiveBg(isZeroAmount))} data-cy='numberX' onClick={handleRightBottomClick}>
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
    paddingLeft: '2rem',
    paddingRight: '2rem',
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
    color: colorVars['--color-textPrimary'],
    height: '83%',
  },
  inputTd: {
    width: '33.33333%',
    paddingLeft: 0,
    paddingRight: 0,
  },
});
