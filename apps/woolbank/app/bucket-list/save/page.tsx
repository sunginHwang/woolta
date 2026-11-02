// static prerender 시 브라우저 전용 코드가 빌드 타임에 실행되므로 동적 렌더 유지
export const dynamic = 'force-dynamic';

import { BucketSaveForm } from '../../../domains/bucket-list/save';

const BucketSavePage = () => {
  return <BucketSaveForm />;
};

export default BucketSavePage;
