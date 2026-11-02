// static prerender 시 빌드 타임에 API를 호출하므로 동적 렌더 유지
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { RegularExtenditureSavePage } from '../../../domains/regular-extenditure/save';

export default function SaveRegularExtenditure() {
  return (
    <Suspense>
      <RegularExtenditureSavePage />
    </Suspense>
  );
}
