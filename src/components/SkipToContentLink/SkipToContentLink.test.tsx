import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SkipToContentLink } from '@/components/SkipToContentLink';

type Messages = {
  text: string;
};

const mockUseMessages = vi.fn<(namespace: string) => Messages>();

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => mockUseMessages(namespace),
}));

vi.mock('@/components/SkipToContentLink/SkipToContentLink.module.css', () => ({
  default: {
    root: 'root',
  },
}));

type MockButtonProps = {
  children: ReactNode;
  as?: string;
  href?: string;
  className?: string;
  variant?: string;
};

const capturedButtonProps: MockButtonProps[] = [];

vi.mock('@/components/Button', () => ({
  Button: (props: MockButtonProps) => {
    capturedButtonProps.push(props);

    const { children, href, className } = props;

    return (
      <a
        data-testid="skip-link"
        href={href}
        className={className}
      >
        {children}
      </a>
    );
  },
}));

describe('SkipToContentLink', () => {
  const getButtonProps = (): MockButtonProps => {
    const props = capturedButtonProps[0];

    if (!props) {
      throw new Error('Expected Button to be rendered once');
    }

    return props;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    capturedButtonProps.length = 0;

    mockUseMessages.mockReturnValue({
      text: 'Skip to content',
    });
  });

  it('renders the skip link text from useMessages', () => {
    render(<SkipToContentLink />);

    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('calls useMessages with the correct namespace', () => {
    render(<SkipToContentLink />);

    expect(mockUseMessages).toHaveBeenCalledWith('skipToContent');
  });

  it('renders as a link with the correct href', () => {
    render(<SkipToContentLink />);

    const link = screen.getByTestId('skip-link');

    expect(link).toHaveAttribute('href', '#content');
  });

  it('passes the correct props to Button', () => {
    render(<SkipToContentLink />);

    const props = getButtonProps();

    expect(props.as).toBe('a');
    expect(props.href).toBe('#content');
    expect(props.variant).toBe('secondary');
    expect(props.className).toBe('root');
  });

  it('applies the root class to the rendered element', () => {
    render(<SkipToContentLink />);

    const link = screen.getByTestId('skip-link');

    expect(link).toHaveClass('root');
  });
});
