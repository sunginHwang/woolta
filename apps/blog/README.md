# Woolta Blog

Woolta 기술 블로그 애플리케이션입니다.

**URL**: https://blog.woolta.com/

## 기술 스택

| 분류 | 기술 |
|-----|-----|
| Framework | Next.js 14.2.1 (App Router) |
| Language | TypeScript 5.1.3 |
| Styling | Styled Components |
| Data Fetching | TanStack React Query |
| Code Editor | CodeMirror 6 |
| Markdown | react-markdown, react-syntax-highlighter |
| Documentation | Storybook |

## 프로젝트 구조

```
apps/blog/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   ├── categories/           # 카테고리 페이지
│   │   └── [categoryNo]/     # 동적 라우팅
│   │       └── [postNo]/     # 포스트 상세
│   ├── write/                # 글쓰기 페이지
│   ├── login/                # 로그인 페이지
│   ├── layout.tsx            # 루트 레이아웃
│   └── page.tsx              # 홈 페이지
├── components/               # React 컴포넌트
│   ├── common/               # 공통 컴포넌트
│   ├── home/                 # 홈 관련 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   ├── post/                 # 포스트 관련 컴포넌트
│   ├── write/                # 글쓰기 컴포넌트
│   └── login/                # 로그인 컴포넌트
├── hooks/                    # Custom Hooks
│   ├── queries/              # React Query 훅
│   └── layout/               # 레이아웃 관련 훅
├── utils/                    # 유틸리티 함수
├── style/                    # 전역 스타일
├── public/                   # 정적 리소스
│   └── sitemap/              # Sitemap XML
├── .storybook/               # Storybook 설정
└── project.json              # Nx 설정
```

## 주요 기능

- **포스트 관리**: 카테고리별 포스트 조회/작성
- **Markdown 에디터**: CodeMirror 기반 마크다운 작성
- **Syntax Highlighting**: 코드 블록 하이라이팅
- **소셜 로그인**: Kakao, Facebook, Google
- **Sitemap**: SEO를 위한 자동 sitemap 생성
- **PWA 지원**: 프로그레시브 웹 앱

## 개발 실행

```bash
# 개발 서버 실행
nx serve blog

# Storybook 실행 (port 4400)
nx storybook blog
```

## 빌드

```bash
nx build blog
```

## 테스트

```bash
nx test blog
```

## 설정 파일

### next.config.js
- Styled Components 활성화
- Sitemap Rewrite 설정
- SVGR 미사용

### Storybook
- 포트: 4400
- Styled Components 데코레이터 적용

## 컨벤션

### 컴포넌트 구조
```
components/
└── ComponentName/
    ├── index.tsx           # 메인 컴포넌트
    ├── ComponentName.styles.ts  # 스타일
    └── ComponentName.stories.tsx # Storybook (선택)
```

### Hooks 네이밍
- Query hooks: `use{Entity}Query`, `use{Entity}Mutation`
- 일반 hooks: `use{기능명}`

### API 호출
- React Query를 통한 서버 상태 관리
- SSR 데이터는 prefetch 활용

```typescript
// hooks/queries/usePostQuery.ts
export const usePostQuery = (postNo: number) => {
  return useQuery({
    queryKey: ['post', postNo],
    queryFn: () => fetchPost(postNo),
  });
};
```

## 의존성

### 주요 라이브러리
- `@uiw/react-codemirror`: Markdown 에디터
- `react-markdown`: Markdown 렌더링
- `react-syntax-highlighter`: 코드 하이라이팅
- `react-kakao-login`, `react-facebook-login`: 소셜 로그인

### 공유 라이브러리
- `@common`: 공통 Hooks, 유틸리티
- `@wds`: 디자인 시스템 컴포넌트
