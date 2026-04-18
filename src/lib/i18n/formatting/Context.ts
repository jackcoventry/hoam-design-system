import { createContext } from 'react';

import { defaultFormatting } from '@/lib/i18n/formatting/defaults';
import type { LibraryFormattingConfig } from '@/lib/i18n/formatting/types';

export const FormattingContext = createContext<LibraryFormattingConfig>(defaultFormatting);
