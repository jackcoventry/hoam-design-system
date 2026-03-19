import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ErrorPanel } from '@/components/ErrorPanel';

vi.mock('@/components/Button', () => ({
  Button: ({
    children,
    as,
    href,
    className,
  }: {
    children: React.ReactNode;
    as?: 'a' | 'button';
    href?: string;
    className?: string;
  }) => {
    if (as === 'a') {
      return (
        <a
          href={href}
          className={className}
        >
          {children}
        </a>
      );
    }

    return <button className={className}>{children}</button>;
  },
}));

describe('ErrorPanel', () => {
  it('renders the error message as a heading', () => {
    render(<ErrorPanel message="Something went wrong" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Something went wrong' })
    ).toBeInTheDocument();
  });

  it('renders the illustration with the correct src and alt text', () => {
    render(<ErrorPanel message="Something went wrong" />);

    const image = screen.getByRole('img', {
      name: 'An illustration of a woman meditating',
    });

    expect(image).toHaveAttribute('src', '/mindfullness.svg');
  });

  it('renders a link back to the homepage', () => {
    render(<ErrorPanel message="Something went wrong" />);

    const link = screen.getByRole('link', { name: 'Return to homepage' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
