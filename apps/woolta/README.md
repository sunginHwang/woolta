# Woolta

Woolta 서비스들을 한눈에 관리하는 대시보드 앱입니다.

**상태**: 개발 중

## 기술 스택

| 분류 | 기술 |
|-----|-----|
| Framework | Next.js 14.2.1 (App Router) |
| Language | TypeScript 5.1.3 |
| Styling | Styled Components + WDS |

## 프로젝트 구조

```
apps/woolta/
├── app/                      # Next.js App Router
│   ├── [appKey]/             # 선택된 앱 화면 (placeholder)
│   ├── api/                  # API Routes
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 대시보드 홈
├── components/
│   ├── app-placeholder/      # 앱 준비 중 placeholder
│   ├── split-pane/           # 좌/우 분할 + 중앙 바 폭 조절 컴포넌트 (앱별 opt-in)
│   └── layout/
│       ├── app-shell/        # 좌측 앱 아이콘 레일 + 콘텐츠 셸
│       └── providers/        # ThemeProvider, styled-components SSR 레지스트리
├── style/                    # 레이아웃 상수
└── public/                   # 정적 리소스
```

## 레이아웃 구조

- **1depth**: 좌측 앱 아이콘 레일 (일정, TODO, 가계부, 캘린더, 블로그, 아티클, 메모) — 하단 토글로 접기/펼치기
- **2depth**: 선택된 앱의 콘텐츠 영역 (`/{appKey}` 라우트)

### SplitPane (선택 사용)

콘텐츠 영역을 좌/우 패널로 나누고 중앙 바 드래그로 폭을 조절하는 컴포넌트입니다.
전역 적용이 아니라 필요한 앱 라우트에서 감싸서 사용합니다.

```tsx
import SplitPane from '../../components/split-pane/SplitPane';

<SplitPane
  storageKey='bank'            // 지정 시 조절된 폭 localStorage 유지
  defaultLeftWidth={320}
  minLeftWidth={200}
  maxLeftWidth={640}
  left={<리스트패널 />}
  right={<상세패널 />}
/>;
```

- 중앙 바 더블클릭: 기본 폭으로 초기화

## 개발 실행

```bash
pnpm turbo run dev --filter=woolta
```

접속: http://localhost:4300

## 빌드

```bash
pnpm turbo run build --filter=woolta
```

## 테스트

```bash
pnpm turbo run test --filter=woolta
```

## 컨벤션

프로젝트 전반의 컨벤션은 루트 README를 참고하세요.

### 공유 라이브러리 사용

```typescript
// 공통 Hooks 사용
import { useInput, useToggle } from '@common';

// 디자인 시스템 사용
import { Text, theme } from '@wds';
```

## 향후 계획

현재 대시보드 레이아웃 셸만 갖춰진 상태이며, 다음 기능들이 추가될 예정입니다:
- 각 앱 서비스 화면 (TODO, 일정, 캘린더, 메모, 아티클 큐레이션)
- 가계부(woolbank), 블로그(blog) 연동
- 사용자 인증
