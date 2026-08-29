# styled-components → StyleX 마이그레이션 가이드

woolta 모노레포의 styled-components 코드를 StyleX 로 전환할 때 따르는 규칙과 레시피.
빌드 통합(@stylexswc/nextjs-plugin), 토큰(tokens.stylex.ts), 테마 브리지는 이미 구성되어 있다 —
이 문서는 **컴포넌트 파일 전환 방법**만 다룬다.

레퍼런스 구현(전환 완료 예시): `apps/woolta/components/layout/app-shell/AppRail.tsx`,
`apps/woolta/components/split-pane/SplitPane.tsx`, `libs/wds/src/lib/atom/Text/index.tsx`,
`libs/wds/src/lib/common/confirm/Confirm.tsx`

## 기본 규칙

1. **파일 단위 전환** — 한 파일 안에서 styled 와 stylex 를 혼용하지 않는다. 전환한 파일에는
   styled-components import 가 남으면 안 된다.
2. **DOM 구조·시각 결과 유지** — 이 마이그레이션은 리팩터가 아니다. 태그 구조, 클래스 붙는 요소,
   최종 CSS 값이 기존과 같아야 한다. 하드코딩된 색/그림자 값은 토큰으로 "개선"하지 말고 그대로 둔다.
3. `stylex.create` 블록은 **컴포넌트 위(모듈 상단)** 에 둔다. prop 축(용도)마다 객체를 나눠도 좋다.
4. 한 엘리먼트에는 `stylex.props()` 를 **한 번만** 호출하고 인자 나열로 합성한다. 순서가 우선순위다(last-wins).

## 값 치환표

| styled-components | StyleX |
|---|---|
| `${({ theme }) => theme.colors.xxx}` | `colorVars['--color-xxx']` — `import { colorVars } from '@wds/tokens.stylex'` |
| `${({ theme }) => theme.shadows.overlay}` | `shadowVars['--shadow-overlay']` |
| `${({ theme }) => theme.zIndex.layer}` | `zIndexConsts.layer` (`@wds/tokens.stylex`) |
| `${typography.body2}` 스프레드 | `stylex.props(typographyStyles.body2, ...)` 인자 — `import { typographyStyles } from '@wds/typography.stylex'` |
| `keyframes\`...\`` | `stylex.keyframes({...})` + `animationName` |
| `styled(Link)` / `styled(motion.div)` | 원본 컴포넌트에 `{...stylex.props(...)}` 스프레드 |
| `as` prop | 스타일이 태그와 분리되므로 원하는 태그에 직접 스프레드 |

## 패턴 레시피

### 1. `const S = { X: styled.div\`...\` }` → `styles` 객체

```tsx
const styles = stylex.create({
  container: { display: 'flex', height: '100%' },
});
// <SC.Container> → <div {...stylex.props(styles.container)}>
```

### 2. boolean 분기 (`$isActive` 등) → 조건부 합성

```tsx
const styles = stylex.create({
  item: { color: colorVars['--color-textInactive'] },
  itemActive: { color: colorVars['--color-interactivePrimary'] },
});
<div {...stylex.props(styles.item, isActive && styles.itemActive)} />
```

### 3. 임의 런타임 값 (`${$percent}%`, `url(${src})`) → dynamic style 함수

```tsx
const dynamicStyles = stylex.create({
  width: (width: number) => ({ width }),
  bgImage: (url: string) => ({ backgroundImage: `url(${url})` }),
});
<div {...stylex.props(styles.base, dynamicStyles.width(leftWidth))} />
```
inline `style={}` 대신 반드시 이 패턴을 쓴다 (클래스 기반이라 이후 오버라이드 가능).

### 4. 의사클래스/미디어쿼리 → **속성 값 안에 중첩**

```tsx
backgroundColor: {
  default: 'transparent',
  ':hover': colorVars['--color-bgSurfaceSecondary'],
},
width: { default: '30rem', '@media (max-width: 768px)': '100%' },
```
셀렉터를 키로 쓰는 최상위 중첩(`':hover': {...}`)이 아니라 속성별 중첩이 기본이다.

### 5. 자손 선택자 (`p { ... }`, `.foo { ... }`, `& > * + *`) — StyleX 미지원

자식 요소에 직접 스타일을 붙이도록 재구성한다:
- 자식이 같은 파일의 JSX 면: 해당 요소에 styles.xxx 를 직접 스프레드
- 자식이 wds `Text` 면: `xstyle` prop 으로 주입 (`<Text xstyle={styles.message} />`)
- `:last-child` 강조처럼 정적 구조면: 해당 요소에 명시적 variant 부여

### 6. shorthand 금지 (StyleX 머지 특성)

- `border: 1px solid X` → `borderWidth/borderStyle/borderColor` (방향별이면 `borderTopWidth` 등)
- `padding: 1rem 2rem` → `paddingBlock: '1rem', paddingInline: '2rem'` (4값이면 방향별)
- `margin: 0 auto` → `marginBlock: 0, marginInline: 'auto'`
- 단일 값 shorthand(`padding: '1rem'`)는 허용

### 7. 스크롤바 숨김 mixin (`invisibleScrollBar`)

```tsx
scrollbarWidth: 'none',
msOverflowStyle: 'none',
'::-webkit-scrollbar': { display: 'none' },  // 최상위 키로 pseudo-element
```

### 8. className 을 외부에서 받는 컴포넌트

```tsx
const sx = stylex.props(styles.base);
<div {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className} />
```

## 제약 사항 (컴파일 에러 방지)

- `stylex.create` 안에서 **일반 모듈 import 값 사용 금지** — 리터럴, 같은 파일 상수,
  `*.stylex.ts` 의 `defineVars`/`defineConsts` 만 가능. 공유 상수가 필요하면
  defineConsts 파일을 만든다 (`apps/woolta/style/layouts.stylex.ts` 참고).
- `defineVars`/`defineConsts` 는 `*.stylex.ts` 파일에서만 선언한다. 토큰 import 는 배럴(@wds)이
  아니라 **`@wds/tokens.stylex` 직접 경로**로 한다.
- CSS 네스팅(`&`) 미지원 — 5번 레시피로 재구성.
- `!important` 금지. 우선순위 문제는 stylex.props 인자 순서로 해결.

## 전환 후 검증

```bash
npx tsc --noEmit -p <해당 lib 또는 앱 tsconfig>   # 타입
npx jest --silent                                  # 루트에서 전체 테스트
cd apps/<consumer> && npx next build               # 소비 앱 빌드 (dev 서버 실행 중이면 금지)
npx eslint "<변경 경로>/**/*.tsx"
```

전환한 파일에 `styled-components` 문자열이 남아 있으면 안 된다:
`grep -rln "styled-components" <경로>`
