import { useToggle } from '@common';
import { useAtomValue, useSetAtom } from 'jotai';
import React, { ComponentProps, FC, useRef } from 'react';
import styled from 'styled-components';
import { FormTemplate } from '../../FormTemplate';
import { TodoAddButton } from '../../../common/TodoAddButton';
import TodoInput from '../../../common/TodoInput';
import { TodoListItem } from '../../../common/TodoListItem';
import { LabelText } from '../../LabelText';
import { Todo, bucketFormAtom, setBucketTodoListAtom } from '../../store';

interface Props extends Pick<ComponentProps<typeof FormTemplate>, 'activeForm'> {}

export const TodoListForm: FC<Props> = ({ activeForm }) => {
  const { todoList } = useAtomValue(bucketFormAtom);
  const setBucketTodoList = useSetAtom(setBucketTodoListAtom);
  const [showAddInput, toggleAddInput] = useToggle(false);
  const [isFocusTodo, toggleFocusTodo] = useToggle(false);
  const addRef = useRef<HTMLDivElement>(null);

  const onAddInput = () => toggleAddInput(true);
  const offAddInput = () => toggleAddInput(false);
  const onFocusTodo = () => toggleFocusTodo(true);
  const offFocusTodo = () => toggleFocusTodo(false);

  /**
   * 할일 아이템 추가
   */
  const onAddTodo = (title: string) => {
    const isExistTodo = todoList.some((todo) => todo.title === title);

    if (isExistTodo) {
      // TODO: toast 치환 필요
      alert('동일한 할일이 존재합니다.');
      return;
    }

    setBucketTodoList([
      ...todoList,
      {
        id: todoList.length + 1,
        title: title,
        isComplete: false,
      },
    ]);
    offAddInput();
    // 추가 후 스크롤 최하단 이동 (입력 편리 ux)
    addRef.current && addRef.current.scrollIntoView();
  };

  /**
   * 할일 완료 상태 토글
   */
  const onToggleState = (toggleTodo: Todo) => {
    const newTodo = [...todoList].map((todo) => {
      if (todo.title === toggleTodo.title) {
        todo.isComplete = !todo.isComplete;
        return todo;
      }

      return todo;
    });
    setBucketTodoList(newTodo);
  };

  /**
   * 할일 삭제
   */
  const onRemove = (id: number) => {
    setBucketTodoList(todoList.filter((todo) => todo.id !== id));
  };

  const isValidForm = activeForm && todoList.length > 0;
  const isShowCompleteButton = !isFocusTodo && activeForm;

  return (
    <FormTemplate
      useScroll
      title='할일 작성'
      isShowButton={isShowCompleteButton}
      isValidForm={isValidForm}
      activeForm={activeForm}
      usePadding={false}
    >
      <SC.AccountInfoAddPhase>
        <SC.TodoForm>
          <LabelText>
            목표를 달성하기 위해 <br /> 해야할 일들을 정해보세요.
          </LabelText>
          <LabelText.Sub>
            목표를 빠르게 달성하기 위해서
            <br />
            필요한 일들을 순차적으로 나열하는것도 좋은 방법입니다.
          </LabelText.Sub>
          <SC.TodoList>
            {todoList.map((todo, index) => {
              return <TodoListItem key={index} todo={todo} onRemove={onRemove} onToggleState={onToggleState} />;
            })}
          </SC.TodoList>
          <SC.TodoAdd ref={addRef}>
            {showAddInput ? (
              <TodoInput onAdd={onAddTodo} onClose={offAddInput} onFocusIn={onFocusTodo} onFocusOut={offFocusTodo} />
            ) : (
              <TodoAddButton onClick={onAddInput} />
            )}
          </SC.TodoAdd>
        </SC.TodoForm>
      </SC.AccountInfoAddPhase>
    </FormTemplate>
  );
};

const SC = {
  TodoForm: styled.div`
    margin: 2rem 0 1rem 0;
  `,
  TodoList: styled.ul`
    width: 100%;

    &:last-child {
      margin-bottom: 10rem;
    }
  `,
  TodoAdd: styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20rem;
  `,
  AccountInfoAddPhase: styled.div`
    height: calc(100vh - 5.5rem);
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Content: styled.div`
    padding-top: 2rem;
    height: 80%;
    > div + div {
      margin-top: 4rem;
    }
  `,
  AddInfo: styled.div<{ show: boolean }>`
    top: ${({ show }) => (show ? 0 : '100%')};
    margin-top: 3rem;
    position: relative;
    transition: all 0.3s ease-out;
    height: 100%;
  `,
};
