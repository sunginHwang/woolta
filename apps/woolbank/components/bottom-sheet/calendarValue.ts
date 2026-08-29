import type { ComponentProps } from 'react';
import type Calendar from 'react-calendar';

/**
 * react-calendar 4 는 Value 를 공개 API 로 내보내지 않는다.
 * `react-calendar/dist/cjs/shared/types` 직접 import 는 패키지 exports 맵이 막고 있어
 * (node10 해석에서만 우연히 통과했다) onChange 시그니처에서 타입을 끌어온다.
 */
export type CalendarValue = Parameters<NonNullable<ComponentProps<typeof Calendar>['onChange']>>[0];
