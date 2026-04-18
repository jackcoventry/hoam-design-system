import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deepMerge, type DeepPartial } from '@/utils/deepMerge';
import { I18nContext } from '@/lib/i18n/Context';
import { defaultMessages } from '@/lib/i18n/defaults';
import { FormattingContext } from '@/lib/i18n/formatting/Context';
import { LibraryI18nProvider } from '@/lib/i18n/Provider';
import type { LibraryMessages } from '@/lib/i18n/types';

function FormattingConsumer() {
  return (
    <FormattingContext.Consumer>
      {(value) => (
        <div>
          {value.locale} | {value.currency}
        </div>
      )}
    </FormattingContext.Consumer>
  );
}

vi.mock('@/utils/deepMerge', () => ({
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

  it('provides default formatting values when locale and currency are not provided', () => {
    render(
      <LibraryI18nProvider>
        <FormattingConsumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-GB | GBP')).toBeInTheDocument();
  });

  it('provides the supplied locale and currency values', () => {
    render(
      <LibraryI18nProvider
        locale="en-US"
        currency="USD"
      >
        <FormattingConsumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-US | USD')).toBeInTheDocument();
  });

  it('updates formatting values when locale and currency props change', () => {
    const { rerender } = render(
      <LibraryI18nProvider
        locale="en-GB"
        currency="GBP"
      >
        <FormattingConsumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-GB | GBP')).toBeInTheDocument();

    rerender(
      <LibraryI18nProvider
        locale="en-US"
        currency="USD"
      >
        <FormattingConsumer />
      </LibraryI18nProvider>
    );

    expect(screen.getByText('en-US | USD')).toBeInTheDocument();
  });
});
