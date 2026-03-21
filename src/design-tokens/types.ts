export type TokenExtensions = {
  $name?: string;
  [key: string]: unknown;
};

export type TokenOriginalValues = {
  fontFamily: string | null;
  fontSize: string | number | null;
  fontWeight: string | number | null;
  lineHeight: string | number | null;
};

export type TokenBase = {
  name: string;
  cssVar: string;
  type: string | null;
  value: unknown;
  group: string | null;
  set: string | null;
  extensions?: TokenExtensions | null;
};

export type TypographyToken = TokenBase & {
  type: 'typography';
  originalValues: TokenOriginalValues;
};

export type Token = TokenBase | TypographyToken;
