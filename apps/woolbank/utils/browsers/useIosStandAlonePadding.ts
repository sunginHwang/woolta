import { useIosStandAlone } from './useIosStandAlone';

const IOS_SAFE_AREA_INSET_BOTTOM = 34;

/**
 * iOS standalone 모드에 따른 bottom padding 값을 반환하는 훅
 * @returns iOS standalone 모드일 때는 고정값(34px), 아닐 때는 CSS env() 함수 사용
 */
export const useIosStandAlonePadding = () => {
  const isIosStandAlone = useIosStandAlone();

  const bottomPadding = isIosStandAlone ? `${IOS_SAFE_AREA_INSET_BOTTOM}px` : 'env(safe-area-inset-bottom)';

  return {
    bottomPadding,
    isIosStandAlone,
  };
};
