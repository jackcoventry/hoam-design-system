import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from '@/components/Layout/Section';

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section>
        <div>Section content</div>
      </Section>
    );

    expect(screen.getByText('Section content')).toBeInTheDocument();
  });

  it('uses section as the default element', () => {
    const { container } = render(
      <Section>
        <div>Section content</div>
      </Section>
    );

    expect(container.firstChild?.nodeName).toBe('SECTION');
  });

  it('renders as a custom element when provided', () => {
    const { container } = render(
      <Section as="div">
        <div>Section content</div>
      </Section>
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies the default space', () => {
    const { container } = render(
      <Section>
        <div>Section content</div>
      </Section>
    );

    expect(container.firstChild).toHaveAttribute('data-space', 'xl');
  });

  it('applies a custom space', () => {
    const { container } = render(
      <Section space="sm">
        <div>Section content</div>
      </Section>
    );

    expect(container.firstChild).toHaveAttribute('data-space', 'sm');
  });

  it('forwards className', () => {
    const { container } = render(
      <Section className="custom-section">
        <div>Section content</div>
      </Section>
    );

    expect(container.firstChild).toHaveClass('custom-section');
  });

  it('forwards native props', () => {
    render(
      <Section
        data-testid="section"
        id="hero-section"
      >
        <div>Section content</div>
      </Section>
    );

    const element = screen.getByTestId('section');

    expect(element).toHaveAttribute('id', 'hero-section');
  });
});
