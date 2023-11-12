import isNil from 'lodash-es/isNil';
import isUndefined from 'lodash-es/isUndefined';
import { MouseEvent, useRef } from 'react';

/**
 * 선택된 카테고리가 포커싱되도록 처리하는 hook
 * @hook
 */
export const useHorizontalFocus = <T extends HTMLElement = HTMLElement>() => {
  const list_ref = useRef<T>(null);
  const item_ref = useRef<Array<HTMLElement | null>>([]);

  // 클릭 시 포커싱처리
  const handleFocusOnClick = (e: MouseEvent<HTMLElement>) => {
    if (!isNil(e.currentTarget) && !isUndefined(list_ref.current)) {
      const { offsetLeft: offset_left, offsetWidth: offset_width } = e.currentTarget;
      list_ref.current?.scrollTo({
        left: offset_left - offset_width,
        behavior: 'smooth',
      });
    }
  };

  // 최초렌더 시 포커싱 처리
  const handleFocusOnFirstRender = (selected_idx: number) => {
    if (list_ref.current && !isUndefined(item_ref.current[selected_idx])) {
      const offset_left = Number(item_ref.current[selected_idx]?.offsetLeft);
      const offset_width = Number(item_ref.current[selected_idx]?.offsetWidth);

      list_ref.current.scrollTo({ left: offset_left - offset_width, behavior: 'smooth' });
    }
  };

  return {
    list_ref,
    item_ref,
    handleFocusOnClick,
    handleFocusOnFirstRender,
  };
};
