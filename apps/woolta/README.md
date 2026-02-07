# Woolta

Woolta 메인 웹 애플리케이션입니다.

**상태**: 개발 중

## 기술 스택

| 분류 | 기술 |
|-----|-----|
| Framework | Next.js 14.2.1 (App Router) |
| Language | TypeScript 5.1.3 |
| Styling | Styled Components |

## 프로젝트 구조

```
apps/woolta/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 홈 페이지
└── public/                   # 정적 리소스
```

## 개발 실행

```bash
nx serve woolta
```

## 로컬 환경 설정

### hosts 설정

로컬 개발을 위해 hosts 파일에 다음을 추가합니다:

```
127.0.0.1 bank-local.woolta.com
```

**macOS/Linux**: `/etc/hosts`
**Windows**: `C:\Windows\System32\drivers\etc\hosts`

### 접속

hosts 설정 후 아래 URL로 접속:
```
http://bank-local.woolta.com:4200
```

## 빌드

```bash
nx build woolta
```

## 테스트

```bash
nx test woolta
```

## 컨벤션

프로젝트 전반의 컨벤션은 루트 README를 참고하세요.

### 공유 라이브러리 사용

```typescript
// 공통 Hooks 사용
import { useInput, useToggle } from '@common';

// 디자인 시스템 사용
import { Text, colors } from '@wds';
```

## 향후 계획

현재 기본 구조만 갖춰진 상태이며, 다음 기능들이 추가될 예정입니다:
- 사용자 인증
- 메인 서비스 기능
- 다른 서비스(blog, woolbank)와의 통합
