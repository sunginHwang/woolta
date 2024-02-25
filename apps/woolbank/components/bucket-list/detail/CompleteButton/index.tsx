import { useAtomValue } from 'jotai';
import { BottomFloatingButton } from '../../../../components/common/BottomFloatingButton';
import { useBucket } from '../hooks/useBucket';
import { isShowCompleteButtonAtom } from '../store';

export const CompleteButton = () => {
  const { bucket, isFetching, completeBucket } = useBucket();
  const isShowCompleteButton = useAtomValue(isShowCompleteButtonAtom);

  const handleCompleteClick = () => {
    if (!bucket.isComplete) {
      completeBucket();
    }
  };

  //TODO: 로딩 업데이트효과도 추가 하기
  return (
    <BottomFloatingButton isShow={isShowCompleteButton} loading={isFetching} onClick={handleCompleteClick}>
      {bucket.isComplete ? '목표 달성 완료' : '달성하기'}
    </BottomFloatingButton>
  );
};
