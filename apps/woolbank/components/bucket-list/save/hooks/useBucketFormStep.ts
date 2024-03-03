import { useAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { bucketFormStepAtom } from '../store';

export const useBucketFormStep = () => {
  const [currentStep, setCurrentPage] = useAtom(bucketFormStepAtom);
  const params = useSearchParams();

  const bucketId = params.get('bucketId') ? Number(params.get('bucketId')) : -1;

  const isUpdateMode = bucketId !== -1;

  const goNextStep = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const goPrevStep = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return {
    bucketId,
    isUpdateMode,
    currentStep,
    goPrevStep,
    goNextStep,
  };
};
