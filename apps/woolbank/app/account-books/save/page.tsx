export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AccountBookSavePage } from '../../../components/account-books/save';

export default function AccountBookSave() {
  return (
    <Suspense>
      <AccountBookSavePage />
    </Suspense>
  );
}
