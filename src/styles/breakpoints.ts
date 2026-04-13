export const BREAKPOINTS = {
  UP: {
    SM: '40rem',
    MD: '48rem',
    LG: '64rem',
    XL: '80rem',
  },
} as const;

export type BreakpointUpKey = 'SM' | 'MD' | 'LG' | 'XL';
