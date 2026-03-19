import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { GridItem } from '@/components/Layout/GridItem';

describe('GridItem', () => {
  it('renders children', () => {
    render(
      <GridItem>
        <div>Grid item content</div>
      </GridItem>
    );

    expect(screen.getByText('Grid item content')).toBeInTheDocument();
  });

  it('uses the default span', () => {
    const { container } = render(
      <GridItem>
        <div>Content</div>
      </GridItem>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--gi-span')).toBe('12');
  });

  it('applies span and start values', () => {
    const { container } = render(
      <GridItem
        span={6}
        start={4}
      >
        <div>Content</div>
      </GridItem>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--gi-span')).toBe('6');
    expect(element.style.getPropertyValue('--gi-start')).toBe('4');
  });

  it('applies responsive span values', () => {
    const { container } = render(
      <GridItem
        span={12}
        spanMd={8}
        spanLg={6}
      >
        <div>Content</div>
      </GridItem>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--gi-span')).toBe('12');
    expect(element.style.getPropertyValue('--gi-span-md')).toBe('8');
    expect(element.style.getPropertyValue('--gi-span-lg')).toBe('6');
  });

  it('applies responsive start values', () => {
    const { container } = render(
      <GridItem
        startMd={3}
        startLg={4}
      >
        <div>Content</div>
      </GridItem>
    );

    const element = container.firstChild as HTMLElement;

    expect(element.style.getPropertyValue('--gi-start-md')).toBe('3');
    expect(element.style.getPropertyValue('--gi-start-lg')).toBe('4');
  });

  it('forwards className', () => {
    const { container } = render(
      <GridItem className="custom-grid-item">
        <div>Content</div>
      </GridItem>
    );

    expect(container.firstChild).toHaveClass('custom-grid-item');
  });

  it('forwards native props', () => {
    render(
      <GridItem
        data-testid="grid-item"
        id="item-1"
      >
        <div>Content</div>
      </GridItem>
    );

    const element = screen.getByTestId('grid-item');

    expect(element).toHaveAttribute('id', 'item-1');
  });
});
