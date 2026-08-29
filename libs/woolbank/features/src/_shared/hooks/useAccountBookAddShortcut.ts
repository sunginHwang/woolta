'use client';

import { useEventListener } from '@common';
import { useCallback, useRef } from 'react';

// 한/영 전환 상태와 Shift 여부에 관계없이 같은 물리 키(q)를 허용한다
const ADD_KEYS = ['q', 'ㅂ', 'ㅃ'];

/** 텍스트 입력 중인 요소에 포커스가 있는지 판정한다. */
const isEditableElement = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  const { tagName } = target;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || target.isContentEditable;
};

/**
 * Q 키로 가계부 작성 폼을 여는 단축키를 등록한다.
 * 입력 요소에 포커스가 있거나 조합키 사용 중, IME 조합 중에는 발동하지 않는다.
 */
export const useAccountBookAddShortcut = (onTrigger: () => void) => {
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  const handleKeyDown = useCallback((event: Event) => {
    const { key, metaKey, ctrlKey, altKey, isComposing, target } = event as KeyboardEvent;

    if (isComposing || metaKey || ctrlKey || altKey) {
      return;
    }
    if (!ADD_KEYS.includes(key.toLowerCase()) || isEditableElement(target)) {
      return;
    }

    event.preventDefault();
    onTriggerRef.current();
  }, []);

  useEventListener('keydown', handleKeyDown);
};
