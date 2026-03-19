import { render, screen } from '@testing-library/react';

import { Skeleton } from '@/components/Loading/Skeleton';

describe('Skeleton', () => {
  it('renders with default props', () => {
    render(<Skeleton data-testid="skeleton" />);

    const el = screen.getByTestId('skeleton');

    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the text variant with correct default height', () => {
    render(
      <Skeleton
        variant="text"
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveStyle({
      height: '1em',
    });
  });

  it('applies the circular variant with correct default height', () => {
    render(
      <Skeleton
        variant="circular"
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveStyle({
      height: '2.5rem',
    });
  });

  it('uses a custom height when provided (overrides variant default)', () => {
    render(
      <Skeleton
        variant="text"
        height="3rem"
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveStyle({
      height: '3rem',
    });
  });

  it('uses a custom width when provided', () => {
    render(
      <Skeleton
        width="200px"
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveStyle({
      width: '200px',
    });
  });

  it('accepts numeric width/height values', () => {
    render(
      <Skeleton
        width={150}
        height={40}
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    // JSDOM converts numbers to px
    expect(el).toHaveStyle({
      width: '150px',
      height: '40px',
    });
  });

  it('applies additional className', () => {
    render(
      <Skeleton
        className="custom-class"
        data-testid="skeleton"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveClass('custom-class');
  });

  it('passes through additional HTML attributes', () => {
    render(
      <Skeleton
        data-testid="skeleton"
        data-foo="bar"
        role="presentation"
      />
    );

    const el = screen.getByTestId('skeleton');

    expect(el).toHaveAttribute('data-foo', 'bar');
    expect(el).toHaveAttribute('role', 'presentation');
  });
});
