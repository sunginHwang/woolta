import { BottomFloatingButton } from '../../../../components/common/BottomFloatingButton';
import { useBucket } from '../hooks/useBucket';

export const CompleteButton = () => {
  const { bucket, isFetching } = useBucket();
  return (
    <>
      <BottomFloatingButton loading={isFetching} disabled={!bucket.isComplete}>
        {bucket.isComplete ? '목표 달성 완료' : '달성하기'}
      </BottomFloatingButton>
    </>
  );
};
