import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deepMerge, type DeepPartial } from '@/utils/merge';
import { I18nContext } from '@/lib/i18n/Context';
import { defaultMessages } from '@/lib/i18n/defaults';
import { LibraryI18nProvider } from '@/lib/i18n/Provider';
import type { LibraryMessages } from '@/lib/i18n/types';

vi.mock('@/utils/merge', () => ({
  deepMerge: vi.fn(),
}));

const mockedDeepMerge = vi.mocked(deepMerge);

function Consumer() {
  return (
    <I18nContext.Consumer>{(value) => <div>{value.global.readMore}</div>}</I18nContext.Consumer>
  );
}

describe('LibraryI18nProvider', () => {
  const mergedMessages: LibraryMessages = defaultMessages;

  const messageOverrides: DeepPartial<LibraryMessages> = {
    global: {
      readMore: 'Read more',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedDeepMerge.mockReturnValue(mergedMessages);
  });

  it('renders its children', () => {
    render(
      <LibraryI18nProvider>
        <div>Child content</div>
      </LibraryI18nProvider>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('calls deepMerge with defaultMessages and undefined when messages are not provided', () => {
    render(
      <LibraryI18nProvider>
        <div>Child content</div>
      </LibraryI18nProvider>
    );

    expect(mockedDeepMerge).toHaveBeenCalledTimes(1);
    expect(mockedDeepMerge).toHaveBeenCalledWith(defaultMessages, undefined);
  });

  it('calls deepMerge with defaultMessages and the provided messages', () => {
    render(
      <LibraryI18nProvider messages={messageOverrides}>
        <div>Child content</div>
      </LibraryI18nProvider>
    );

    expect(mockedDeepMerge).toHaveBeenCalledTimes(1);
    expect(mockedDeepMerge).toHaveBeenCalledWith(defaultMessages, messageOverrides);
  });

  it('provides the merged messages via I18nContext', () => {
    render(
      <LibraryI18nProvider messages={messageOverrides}>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText(defaultMessages.global.readMore)).toBeInTheDocument();
  });

  it('recomputes when messages changes', () => {
    const firstMessages: DeepPartial<LibraryMessages> = {
      global: { readMore: 'Read more' },
    };

    const secondMessages: DeepPartial<LibraryMessages> = {
      skipToContent: { text: 'Skip to main content' },
    };

    const { rerender } = render(
      <LibraryI18nProvider messages={firstMessages}>
        <Consumer />
      </LibraryI18nProvider>
    );

    rerender(
      <LibraryI18nProvider messages={secondMessages}>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(mockedDeepMerge).toHaveBeenCalledTimes(2);
    expect(mockedDeepMerge).toHaveBeenNthCalledWith(1, defaultMessages, firstMessages);
    expect(mockedDeepMerge).toHaveBeenNthCalledWith(2, defaultMessages, secondMessages);
  });

  it('uses the value returned by deepMerge as the provider value', () => {
    mockedDeepMerge.mockReturnValue(defaultMessages);

    render(
      <LibraryI18nProvider messages={messageOverrides}>
        <Consumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText(defaultMessages.global.readMore)).toBeInTheDocument();
  });
});
