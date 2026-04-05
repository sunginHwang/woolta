// Colors (re-exported from colors/ - these are also in lib/style/colors, no conflict)
export type { FontVariant, TypographyValue } from './typography';

// Typography as platform-agnostic value objects (distinct from CSS-based `typography` in lib/style/font.ts)
export { typography as typographyTokens } from './typography';

// Spacing (new)
export { spacing } from './spacing';
export type { SpacingKey } from './spacing';

// Radius (new)
export { radius } from './radius';
export type { RadiusKey } from './radius';
