import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { ButtonHTMLAttributes, FC, MouseEvent } from 'react';
import { ClipLoader } from 'react-spinners';
import { IconPlus } from '../../../../components/atom/Icon';

interface Props extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  isLoading?: boolean;
}

const styles = stylex.create({
  button: {
    borderRadius: '50%',
    height: '4rem',
    width: '4rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-red500'],
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-red500'],
  },
});

/**
 * todo 추가 버튼
 * @component
 */

export const TodoAddButton: FC<Props> = ({ isLoading = false, onClick }) => {
  return (
    <button
      {...stylex.props(styles.button)}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        if (!isLoading && onClick) {
          onClick(e);
        }
      }}
    >
      {isLoading ? <ClipLoader color='#f03e3e' size={20} /> : <IconPlus />}
    </button>
  );
};
