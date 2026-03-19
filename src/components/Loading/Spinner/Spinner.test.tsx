import { render, screen } from '@testing-library/react';

import { Spinner } from '@/components/Loading/Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    const { container } = render(<Spinner />);

    const spinner = screen.getByRole('status');

    expect(spinner).toBeInTheDocument();
    expect(spinner.tagName).toBe('DIV');
    expect(spinner).toHaveAttribute('aria-live', 'polite');

    const visualSpinner = container.querySelector('span[aria-hidden="true"]');
    expect(visualSpinner).not.toBeNull();
  });

  it('renders a custom accessible label', () => {
    render(<Spinner label="Fetching results" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('allows aria-live to be overridden', () => {
    render(<Spinner ariaLive="off" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'off');
  });

  it('renders as a different element when using the as prop', () => {
    render(
      <Spinner
        as="span"
        data-testid="spinner"
      />
    );

    const spinner = screen.getByTestId('spinner');

    expect(spinner.tagName).toBe('SPAN');
    expect(spinner).toHaveAttribute('role', 'status');
  });

  it('passes through additional props to the rendered element', () => {
    render(
      <Spinner
        data-testid="spinner"
        id="loading-spinner"
        title="Loading content"
      />
    );

    const spinner = screen.getByTestId('spinner');

    expect(spinner).toHaveAttribute('id', 'loading-spinner');
    expect(spinner).toHaveAttribute('title', 'Loading content');
  });

  it('applies a custom className', () => {
    render(
      <Spinner
        data-testid="spinner"
        className="custom-class"
      />
    );

    expect(screen.getByTestId('spinner')).toHaveClass('custom-class');
  });

  it('contains a decorative inner spinner element', () => {
    const { container } = render(<Spinner />);

    const visualSpinner = container.querySelector('span[aria-hidden="true"]');

    expect(visualSpinner).not.toBeNull();
    expect(visualSpinner).toHaveAttribute('aria-hidden', 'true');
  });
});
