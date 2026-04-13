import { createContext } from 'react';

import { defaultMessages } from '@/i18n/defaults';
import type { LibraryMessages } from '@/i18n/types';

export const I18nContext = createContext<LibraryMessages>(defaultMessages);
