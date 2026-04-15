export type TokenRecord = Record<string, unknown>;

export type RawTypographyValue = {
  fontFamily?: unknown;
  fontSize?: unknown;
  fontWeight?: unknown;
  lineHeight?: unknown;
};

export type StyleDictionaryToken = {
  name: string;
  path: string[];
  $type?: string;
  $value?: unknown;
  original?: {
    $value?: RawTypographyValue;
  };
  attributes?: {
    group?: string | null;
    set?: string | null;
  };
};

export type StyleDictionaryDictionary = {
  allTokens: StyleDictionaryToken[];
};

export type StyleDictionaryFormatArgs = {
  dictionary: StyleDictionaryDictionary;
};

export type SpacingEntry = {
  key: string;
  tokenKey: string;
  value: string;
};

export type BreakpointEntry = {
  key: string;
  value: string;
};

export type ConfigFile = {
  destination?: string;
  format?: string;
  filter?: ((token: { path: string[] }) => boolean) | string;
};

export type ConfigPlatform = {
  files?: ConfigFile[];
};

export type SDConfig = {
  platforms?: Record<string, ConfigPlatform>;
};
