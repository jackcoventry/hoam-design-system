import { createContext } from 'react';

import { defaultMessages } from '@/lib/i18n/defaults';
import type { LibraryMessages } from '@/lib/i18n/types';

export const I18nContext = createContext<LibraryMessages>(defaultMessages);
