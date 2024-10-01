export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { BucketList } from '../../components/bucket-list/main';

export default async function BucketListPage() {
  return (
    <Suspense>
      <BucketList />
    </Suspense>
  );
}
