# wds — Woolta Design System

`woolta` 서비스(blog · woolbank · woolta)가 공유하는 디자인 토큰과 컴포넌트입니다.
특정 도메인에 의존하지 않는 요소만 둡니다.

## 스토리북

```bash
pnpm turbo run storybook --filter=@woolta/wds   # http://localhost:4600
pnpm --filter @woolta/wds test-storybook        # 스토리를 크로미움에서 렌더링해 검증
pnpm --filter @woolta/wds build-storybook       # dist/storybook/wds
```

사이드바는 **Intro → Foundations → Components → Utilities** 순서입니다.
구조·토큰 계층·컴포넌트 추가 규칙은 스토리북의 Intro 페이지(`src/docs/Intro.mdx`)가 단일 소스입니다.

```
src/
├── docs/            # Intro + Foundations MDX 와 문서용 블록 (패키지 export 아님)
├── lib/style/       # Foundations: 색상·타이포·그림자·z-index 토큰
├── lib/atom/        # Components / Utilities
└── lib/common/      # Confirm, Suspense
```
