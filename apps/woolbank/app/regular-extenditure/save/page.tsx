export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { RegularExtenditureSavePage } from '../../../components/regular-extenditure/save';

export default function SaveRegularExtenditure() {
  return (
    <Suspense>
      <RegularExtenditureSavePage />
    </Suspense>
  );
}
