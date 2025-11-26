import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import RichLink from './RichLink';

describe('RichLink', () => {
  const mockProps = {
    href: '/somewhere',
    title: 'Read more',
    image: '/img/test.png',
  };

  it('renders the link with correct href', () => {
    render(<RichLink {...mockProps} />);

    const link = screen.getByRole('link', { name: /read more/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/somewhere');
  });

  it('renders the title inside a span', () => {
    render(<RichLink {...mockProps} />);

    const text = screen.getByText('Read more');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('hoam-rich-link__text');
  });

  it('renders the image with the correct src', () => {
    render(<RichLink {...mockProps} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img/test.png');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveClass('hoam-rich-link__image');
  });

  it('applies the correct CSS class to the root element', () => {
    render(<RichLink {...mockProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('hoam-rich-link');
  });

  it('handles missing props safely', () => {
    // Undefined props should not break the component
    render(
      (
        <RichLink
          href={undefined}
          title={undefined}
          image={undefined}
        />
      ) as any
    );

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();

    // href is undefined
    expect(link).toHaveAttribute('href', '');

    // title not provided → empty span exists
    expect(screen.getByText('')).toBeInTheDocument();

    // image missing → img rendered with empty src
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '');
  });
});
