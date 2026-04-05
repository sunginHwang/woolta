import { palette } from './palette';
import type { SemanticColorTokens } from './types';

export const lightSemanticTokens: SemanticColorTokens = {
  // Text
  textPrimary: palette.gray[800],
  textSecondary: palette.gray[700],
  textTertiary: palette.gray[500],
  textDisabled: palette.gray[300],
  textInverse: palette.white,
  textActive: palette.gray[900],
  textInactive: palette.gray[600],

  // Background / Surface
  bgPage: palette.gray[50],
  bgSurface: palette.white,
  bgSurfaceSecondary: palette.gray[100],
  bgOverlay: palette.white,
  bgInverse: palette.gray[900],

  // Border
  borderDefault: palette.gray[400],
  borderSubtle: palette.gray[300],
  borderStrong: palette.gray[600],
  borderFaint: palette.gray[100],

  // Interactive
  interactivePrimary: palette.orange[600],
  interactivePrimaryHover: palette.red[500],
  interactivePrimaryDisabled: palette.gray[300],

  // Brand
  brandPrimary: palette.pink[600],
  brandLight: palette.pink[200],
  brandDisabled: palette.pink[150],

  // Status
  statusSuccess: palette.green[500],
  statusWarning: palette.yellow[600],
  statusError: palette.red[500],
  statusInfo: palette.blue[400],
};

export const darkSemanticTokens: SemanticColorTokens = {
  // Text
  textPrimary: '#E0E0E0',
  textSecondary: '#A0A0A0',
  textTertiary: '#6B6B6B',
  textDisabled: '#4A4A4A',
  textInverse: palette.gray[900],
  textActive: '#F5F5F5',
  textInactive: '#787878',

  // Background / Surface
  bgPage: '#121212',
  bgSurface: '#1E1E1E',
  bgSurfaceSecondary: '#2A2A2A',
  bgOverlay: '#1E1E1E',
  bgInverse: '#F5F5F5',

  // Border
  borderDefault: '#3A3A3A',
  borderSubtle: '#2E2E2E',
  borderStrong: '#555555',
  borderFaint: '#1F1F1F',

  // Interactive
  interactivePrimary: '#FF6B6B',
  interactivePrimaryHover: '#FF5252',
  interactivePrimaryDisabled: '#4A4A4A',

  // Brand
  brandPrimary: '#FF4D8A',
  brandLight: '#FF8AB5',
  brandDisabled: '#804060',

  // Status
  statusSuccess: '#6BD975',
  statusWarning: '#FFD54F',
  statusError: '#FF5252',
  statusInfo: '#6B8AFF',
};
