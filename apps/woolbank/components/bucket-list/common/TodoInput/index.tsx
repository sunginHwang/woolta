import { useInput, useMount } from '@common';
import { IconBlackCircle } from 'apps/woolbank/components/atom/Icon';
import React, { FC, useRef } from 'react';
import styled, { useTheme } from 'styled-components';

interface Props {
  onAdd: (title: string) => void;
  onClose: () => void;
  onFocusIn: () => void;
  onFocusOut: () => void;
}

/**
 * todo input 영역
 * @component
 */
export const TodoInput: FC<Props> = ({ onAdd, onClose, onFocusIn, onFocusOut }) => {
  const [title, onChangeTitle] = useInput('');
  const todoInputRef = useRef<HTMLInputElement>(null);
  const { colors } = useTheme();

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
    <S.TodoInput>
      <S.Input>
        <i onClick={onClose}>
          <IconBlackCircle fill={colors.red500} />
        </i>
        <input
          data-cy='todoInput'
          ref={todoInputRef}
          value={title}
          onFocus={onFocusIn}
          onBlur={onFocusOut}
          onChange={onChangeTitle}
          onKeyPress={onTitleKeyPress}
        />
      </S.Input>
      <S.Footer>
        <S.Button onClick={onAddTodo}>작업 추가</S.Button>
        <S.Button onClick={onClose} isCancel>
          취소
        </S.Button>
      </S.Footer>
    </S.TodoInput>
  );
};

type ButtonProps = {
  isCancel?: boolean;
};
const S = {
  Button: styled.button<ButtonProps>`
    padding: 0.7rem 1rem;
    border-radius: 0.5rem;
    font-size: 1.2rem;
    background-color: ${({ theme, isCancel }) => (isCancel ? theme.colors.white : theme.colors.red500)};
    color: ${({ theme, isCancel }) => (isCancel ? theme.colors.black : theme.colors.white)};
  `,
  Footer: styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  `,
  Input: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  `,
  TodoInput: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0.9rem 1.5rem;
    border-radius: 0.8rem;
    box-shadow: rgb(220, 220, 233) 0.1rem 0.4rem 1.7rem 0.3rem;

    i {
      height: 2.2rem;
      margin-right: 1rem;
    }

    input {
      flex: 1;
      background-color: #f2f3f5;
      border-radius: 0.8rem;
      padding: 1rem 2rem;
      border: 0.1rem solid ${({ theme }) => theme.colors.gray600};
      font-size: 1.2rem;
      margin-right: 0.5rem;

      &::placeholder {
        color: #65676b;
      }
    }
  `,
};

export default TodoInput;
