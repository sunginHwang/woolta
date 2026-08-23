import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from './useEventListener';

const DEFAULT_SAVED_INDICATOR_DURATION_MS = 1_500;

interface Options {
  /**
   * '저장됨' 표시를 유지하는 시간(ms)
   * @default 1500
   */
  savedIndicatorDurationMs?: number;
}

/**
 * ⌘/Ctrl + S 저장 단축키를 등록한다.
 * 브라우저 기본 저장 동작을 막고 onSave 를 호출한 뒤, 잠시 '저장됨' 상태를 true 로 유지한다.
 * 디바운스 자동저장을 쓰는 화면에서 사용자가 즉시 저장하고 싶을 때 함께 쓴다.
 * @param onSave 대기 중인 변경을 즉시 저장하는 함수
 * @param options 표시 시간 등 옵션
 */
export const useManualSave = (onSave: () => void, { savedIndicatorDurationMs }: Options = {}) => {
  const [isJustSaved, setIsJustSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const durationMs = savedIndicatorDurationMs ?? DEFAULT_SAVED_INDICATOR_DURATION_MS;

  const handleSaveKeyDown = useCallback(
    (event: Event) => {
      const { metaKey, ctrlKey, key } = event as KeyboardEvent;
      const isSaveShortcut = (metaKey || ctrlKey) && key.toLowerCase() === 's';

      if (!isSaveShortcut) {
        return;
      }

      event.preventDefault();
      onSave();
      setIsJustSaved(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsJustSaved(false), durationMs);
    },
    [onSave, durationMs],
  );

  useEventListener('keydown', handleSaveKeyDown);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { isJustSaved };
};
