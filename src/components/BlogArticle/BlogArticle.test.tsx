import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { BlogArticle, BlogArticleProps } from '@/components/BlogArticle';

vi.mock('@/components/Common/BodyText', () => ({
  BodyText: ({ children }: { children: ReactNode }) => (
    <div data-testid="body-text">{children}</div>
  ),
}));

vi.mock('@/components/Icon', () => ({
  Icon: ({ id }: { id: string }) => <span data-testid="icon">{id}</span>,
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children }: { children: ReactNode }) => <div data-testid="grid">{children}</div>,
  GridItem: ({
    children,
    span,
    spanLg,
    startLg,
  }: {
    children?: ReactNode;
    span?: number;
    spanLg?: number;
    startLg?: number;
  }) => (
    <div
      data-testid="grid-item"
      data-span={span}
      data-span-lg={spanLg}
      data-start-lg={startLg}
    >
      {children}
    </div>
  ),
  Stack: ({ children, gap }: { children: ReactNode; gap?: string }) => (
    <div
      data-testid="stack"
      data-gap={gap}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/hooks/useMessages', () => ({
  useMessages: (namespace: string) => {
    if (namespace === 'blogArticle') {
      return {
        by: 'By',
        avatarAria: 'Avatar for',
        readingTime: 'min read',
        tags: 'Tags',
      };
    }

    if (namespace === 'global') {
      return {
        share: 'Share',
        shareAria: 'Share on',
      };
    }

    return {};
  },
}));

vi.mock('@/utils/convertDates', () => ({
  parseLooseDate: vi.fn((date: string) => {
    if (date === 'invalid-date') {
      return null;
    }

    return new Date('2026-04-10T00:00:00.000Z');
  }),
  formatReadableDate: vi.fn(() => '10 April 2026'),
  formatISODate: vi.fn(() => '2026-04-10'),
}));

describe('BlogArticle', () => {
  const baseProps: BlogArticleProps = {
    category: 'Technology',
    title: 'How to Build Better Components',
    summary: 'A practical guide to designing UI components well.',
    author: {
      name: 'Jane Smith',
      id: 'jane-smith',
      image: '/authors/jane.jpg',
    },
    publishDate: '2026-04-10',
    readingTime: 8,
    image: {
      src: '/blog/hero.jpg',
      alt: 'A desk setup with code on screen',
      caption: 'A calm place to write code.',
    },
    tags: [
      { id: 'react', name: 'React' },
      { id: 'testing', name: 'Testing' },
    ],
    socialLinks: [
      { label: 'Twitter', href: 'https://twitter.com/share', icon: 'twitter' },
      { label: 'LinkedIn', href: 'https://linkedin.com/share', icon: 'linkedin' },
    ],
    children: <p>Article body content</p>,
  };

  it('renders the main article content', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'How to Build Better Components' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'A practical guide to designing UI components well.',
      })
    ).toBeInTheDocument();
  });

  it('renders author information and profile link', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('By')).toBeInTheDocument();

    const authorLink = screen.getByRole('link', { name: /jane smith/i });
    expect(authorLink).toHaveAttribute('href', '/profile/jane-smith');
    expect(authorLink).toHaveAttribute('rel', 'author');

    const avatar = screen.getByRole('img', { name: 'Avatar for Jane Smith' });
    expect(avatar).toHaveAttribute('src', '/authors/jane.jpg');
  });

  it('renders the formatted publish date', () => {
    render(<BlogArticle {...baseProps} />);

    const time = screen.getByText('10 April 2026');
    expect(time.tagName).toBe('TIME');
    expect(time).toHaveAttribute('dateTime', '2026-04-10');
  });

  it('renders the reading time with a clock icon', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('8 min read')).toBeInTheDocument();
    expect(screen.getByText('clock')).toBeInTheDocument();
  });

  it('renders social share links when provided', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('Share')).toBeInTheDocument();

    const twitterLink = screen.getByRole('link', { name: 'Share on Twitter' });
    const linkedinLink = screen.getByRole('link', { name: 'Share on LinkedIn' });

    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/share');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/share');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the hero image and caption', () => {
    render(<BlogArticle {...baseProps} />);

    const heroImage = screen.getByRole('img', { name: 'A desk setup with code on screen' });
    expect(heroImage).toHaveAttribute('src', '/blog/hero.jpg');

    expect(screen.getByText('A calm place to write code.')).toBeInTheDocument();
  });

  it('renders children inside BodyText', () => {
    render(<BlogArticle {...baseProps} />);

    const bodyText = screen.getByTestId('body-text');
    expect(bodyText).toContainElement(screen.getByText('Article body content'));
  });

  it('renders tags and tag links when tags are provided', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByText('Tags:')).toBeInTheDocument();

    const reactTag = screen.getByRole('link', { name: 'React' });
    const testingTag = screen.getByRole('link', { name: 'Testing' });

    expect(reactTag).toHaveAttribute('href', '/blog/tag/react');
    expect(testingTag).toHaveAttribute('href', '/blog/tag/testing');
  });

  it('does not render tags section when tags array is empty', () => {
    render(
      <BlogArticle
        {...baseProps}
        tags={[]}
      />
    );

    expect(screen.queryByText('Tags:')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'React' })).not.toBeInTheDocument();
  });

  it('does not render social links when none are provided', () => {
    render(
      <BlogArticle
        {...baseProps}
        socialLinks={[]}
      />
    );

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /share on/i })).not.toBeInTheDocument();
  });

  it('does not render the hero image block when image is missing', () => {
    render(
      <BlogArticle
        {...baseProps}
        image={undefined as never}
      />
    );

    expect(
      screen.queryByRole('img', { name: 'A desk setup with code on screen' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('A calm place to write code.')).not.toBeInTheDocument();
  });

  it('renders empty date values when the publish date cannot be parsed', () => {
    render(
      <BlogArticle
        {...baseProps}
        publishDate="invalid-date"
      />
    );

    const timeElements = screen.getAllByText('', { selector: 'time' });
    expect(timeElements[0]).toHaveAttribute('dateTime', '');
  });

  it('renders the expected layout wrappers', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getAllByTestId('container')).toHaveLength(4);
    expect(screen.getAllByTestId('grid')).toHaveLength(4);
  });

  it('passes the expected gap to Stack', () => {
    render(<BlogArticle {...baseProps} />);

    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'md');
  });

  it('renders body grid item with the expected large-screen positioning props', () => {
    render(<BlogArticle {...baseProps} />);

    const gridItems = screen.getAllByTestId('grid-item');
    const bodyGridItem = gridItems.find(
      (item) =>
        item.dataset.span === '12' && item.dataset.spanLg === '8' && item.dataset.startLg === '3'
    );

    expect(bodyGridItem).toBeDefined();
  });

  it('renders image grid item with the expected spans', () => {
    render(<BlogArticle {...baseProps} />);

    const gridItems = screen.getAllByTestId('grid-item');
    const imageGridItem = gridItems.find(
      (item) => item.dataset.span === '12' && item.dataset.spanLg === '12'
    );

    expect(imageGridItem).toBeDefined();
  });
});
