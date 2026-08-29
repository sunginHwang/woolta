import { useInput, useMount } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type React from 'react';
import { type FC, useRef } from 'react';
import { IconBlackCircle } from '../../../../components/atom/Icon';

interface Props {
  onAdd: (title: string) => void;
  onClose: () => void;
  onFocusIn: () => void;
  onFocusOut: () => void;
}

const styles = stylex.create({
  todoInput: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    paddingBlock: '0.9rem',
    paddingInline: '1.5rem',
    borderRadius: '0.8rem',
    boxShadow: 'rgb(220, 220, 233) 0.1rem 0.4rem 1.7rem 0.3rem',
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  iconSlot: {
    height: '2.2rem',
    marginRight: '1rem',
  },
  inputField: {
    flex: 1,
    backgroundColor: '#f2f3f5',
    borderRadius: '0.8rem',
    paddingBlock: '1rem',
    paddingInline: '2rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: 'rgb(238, 238, 238)',
    fontSize: '1.2rem',
    marginRight: '0.5rem',
    '::placeholder': { color: '#65676b' },
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '1rem',
  },
  button: {
    paddingBlock: '0.7rem',
    paddingInline: '1rem',
    borderRadius: '0.5rem',
    fontSize: '1.2rem',
    backgroundColor: colorVars['--color-red500'],
    color: colorVars['--color-white'],
  },
  buttonCancel: {
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-black'],
  },
});

/**
 * todo input 영역
 * @component
 */
export const TodoInput: FC<Props> = ({ onAdd, onClose, onFocusIn, onFocusOut }) => {
  const [title, onChangeTitle] = useInput('');
  const todoInputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트 생성시 바로 포커스 UX 처리
  useMount(() => {
    todoInputRef.current && todoInputRef.current.focus();
  });

  // 인풋 버튼 키보드 입력
  const onTitleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return null;
    }

    onAddTodo();
  };

  // 할일 추가
  const onAddTodo = () => {
    if (title !== '') {
      onAdd(title);
      // 바로 focus 아웃 시키면 키보드 에 버튼이 보이고 내려가는 ux 상 안이쁘게 보여서 딜레이 처리
      setTimeout(() => onFocusOut(), 150);
    }
  };

  return (
    <div {...stylex.props(styles.todoInput)}>
      <div {...stylex.props(styles.inputRow)}>
        <i {...stylex.props(styles.iconSlot)} onClick={onClose}>
          <IconBlackCircle fill='#f03e3e' />
        </i>
        <input
          {...stylex.props(styles.inputField)}
          data-cy='todoInput'
          ref={todoInputRef}
          value={title}
          onFocus={onFocusIn}
          onBlur={onFocusOut}
          onChange={onChangeTitle}
          onKeyPress={onTitleKeyPress}
        />
      </div>
      <div {...stylex.props(styles.footer)}>
        <button {...stylex.props(styles.button)} onClick={onAddTodo}>
          작업 추가
        </button>
        <button {...stylex.props(styles.button, styles.buttonCancel)} onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
};

export default TodoInput;
