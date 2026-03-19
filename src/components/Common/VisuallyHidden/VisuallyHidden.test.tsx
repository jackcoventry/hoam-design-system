import { render, screen } from '@testing-library/react';

import { VisuallyHidden } from '@/components/Common/VisuallyHidden';

describe('VisuallyHidden', () => {
  it('renders a span by default', () => {
    render(<VisuallyHidden>Hidden text</VisuallyHidden>);

    const element = screen.getByText('Hidden text');

    expect(element.tagName).toBe('SPAN');
  });

  it('renders the provided children', () => {
    render(<VisuallyHidden>Screen reader only content</VisuallyHidden>);

    expect(screen.getByText('Screen reader only content')).toBeInTheDocument();
  });

  it('renders as the element passed to the as prop', () => {
    render(<VisuallyHidden as="div">Hidden content</VisuallyHidden>);

    const element = screen.getByText('Hidden content');

    expect(element.tagName).toBe('DIV');
  });

  it('forwards additional props to the rendered element', () => {
    render(
      <VisuallyHidden
        as="button"
        type="button"
        aria-label="Close"
        data-testid="visually-hidden-button"
      >
        Close
      </VisuallyHidden>
    );

    const element = screen.getByTestId('visually-hidden-button');

    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveAttribute('type', 'button');
    expect(element).toHaveAttribute('aria-label', 'Close');
    expect(element).toHaveTextContent('Close');
  });

  it('supports semantic elements like label', () => {
    render(
      <VisuallyHidden
        as="label"
        htmlFor="email"
      >
        Email address
      </VisuallyHidden>
    );

    const element = screen.getByText('Email address');

    expect(element.tagName).toBe('LABEL');
    expect(element).toHaveAttribute('for', 'email');
  });
});
