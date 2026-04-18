export type SupportedLocale = string;
export type SupportedCurrency = string;

export type CurrencyFormatOptions = Readonly<{
  locale: SupportedLocale;
  currency: SupportedCurrency;
}>;

export type LibraryFormattingConfig = Readonly<{
  locale: SupportedLocale;
  currency: SupportedCurrency;
}>;
