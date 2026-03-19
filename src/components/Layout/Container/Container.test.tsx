import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from '@/components/Layout/Container';

describe('Container', () => {
  it('renders children', () => {
    render(
      <Container>
        <div>Content</div>
      </Container>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the default width', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );

    expect(container.firstChild).toHaveAttribute('data-width', 'default');
  });

  it('applies a custom width', () => {
    const { container } = render(
      <Container width="wide">
        <div>Content</div>
      </Container>
    );

    expect(container.firstChild).toHaveAttribute('data-width', 'wide');
  });

  it('forwards className', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards native props', () => {
    render(
      <Container
        data-testid="container"
        id="layout-container"
      >
        <div>Content</div>
      </Container>
    );

    const element = screen.getByTestId('container');

    expect(element).toHaveAttribute('id', 'layout-container');
  });
});
