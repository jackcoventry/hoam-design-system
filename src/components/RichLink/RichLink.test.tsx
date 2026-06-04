import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RichLink } from '@/components/RichLink';

describe('RichLink', () => {
  it('renders a link with the correct href', () => {
    render(
      <RichLink
        href="/articles/design-systems"
        title="Design systems"
        image="/images/design-systems.jpg"
        imageAlt="Abstract design system illustration"
      />
    );

    const link = screen.getByRole('link', {
      name: 'Design systems Abstract design system illustration',
    });

    expect(link).toHaveAttribute('href', '/articles/design-systems');
  });

  it('renders the title text', () => {
    render(
      <RichLink
        href="/articles/design-systems"
        title="Design systems"
        image="/images/design-systems.jpg"
        imageAlt="Abstract design system illustration"
      />
    );

    expect(screen.getByText('Design systems')).toBeInTheDocument();
  });

  it('applies a custom className to the link root', () => {
    render(
      <RichLink
        href="/articles/design-systems"
        title="Design systems"
        image="/images/design-systems.jpg"
        className="custom-rich-link"
      />
    );

    expect(screen.getByRole('link', { name: 'Design systems' })).toHaveClass('custom-rich-link');
  });

  it('renders the image with the provided alt text', () => {
    render(
      <RichLink
        href="/articles/design-systems"
        title="Design systems"
        image="/images/design-systems.jpg"
        imageAlt="Abstract design system illustration"
      />
    );

    const image = screen.getByAltText('Abstract design system illustration');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/design-systems.jpg');
  });

  it('uses an empty alt attribute when imageAlt is not provided', () => {
    const { container } = render(
      <RichLink
        href="/articles/design-systems"
        title="Design systems"
        image="/images/design-systems.jpg"
      />
    );

    const link = screen.getByRole('link', { name: 'Design systems' });
    const image = container.querySelector('img');

    expect(link).toHaveAttribute('href', '/articles/design-systems');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/design-systems.jpg');
    expect(image).toHaveAttribute('alt', '');
  });
});
