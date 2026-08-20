import { ThemeType } from '@wds';
import { atomWithStorage } from 'jotai/utils';

export const themeTypeAtom = atomWithStorage<ThemeType>('woolta:theme', 'light');

export const railExpandedAtom = atomWithStorage<boolean>('woolta:rail-expanded', false);
