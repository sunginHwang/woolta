'use client';

import { useEventListener } from '@common';
import { useCallback, useState } from 'react';

// 한/영 전환 상태와 Shift 여부에 관계없이 같은 물리 키(q)를 허용한다
const TODO_ADD_KEYS = ['q', 'ㅂ', 'ㅃ'];

/** 텍스트 입력 중인 요소에 포커스가 있는지 판정한다. */
const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const { tagName } = target;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
};

/**
 * Q 키로 할 일 추가 오버레이를 여는 단축키를 등록한다.
 * 입력 요소에 포커스가 있거나 조합키 사용 중, IME 조합 중에는 열지 않는다.
 * Esc 는 입력 중에도 항상 오버레이를 닫는다.
 */
export const useTodoAddShortcut = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  const handleKeyDown = useCallback((event: Event) => {
    const { key, metaKey, ctrlKey, altKey, isComposing, target } = event as KeyboardEvent;

    if (key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (isComposing || metaKey || ctrlKey || altKey) {
      return;
    }
    if (!TODO_ADD_KEYS.includes(key.toLowerCase()) || isEditableElement(target)) {
      return;
    }

    event.preventDefault();
    setIsOpen(true);
  }, []);

  useEventListener('keydown', handleKeyDown);

  return { isOpen, close };
};
