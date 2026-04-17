import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Banner, type BannerProps } from '@/components/Banner';
import { useMessages } from '@/hooks/useMessages';
import { LibraryMessages } from '@/lib/i18n/types';

vi.mock('@/hooks/useMessages', () => ({
  useMessages: vi.fn(),
}));

vi.mock('@/components/Button', () => ({
  Button: ({ children, variant }: { children: ReactNode; variant?: string }) => (
    <button
      type="button"
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

vi.mock('@/components/Layout', () => ({
  Container: ({ children }: { children: ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
  Grid: ({ children, cols }: { children: ReactNode; cols?: number }) => (
    <div
      data-testid="grid"
      data-cols={cols}
    >
      {children}
    </div>
  ),
  GridItem: ({
    children,
    span,
    spanMd,
    className,
  }: {
    children: ReactNode;
    span?: number;
    spanMd?: number;
    className?: string;
  }) => (
    <div
      data-testid="grid-item"
      data-span={span}
      data-span-md={spanMd}
      className={className}
    >
      {children}
    </div>
  ),
  Section: ({ children }: { children: ReactNode }) => (
    <section data-testid="section">{children}</section>
  ),
  Stack: ({
    children,
    gap,
    className,
  }: {
    children: ReactNode;
    gap?: string;
    className?: string;
  }) => (
    <div
      data-testid="stack"
      data-gap={gap}
      className={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/Banner/Banner.module.css', () => ({
  default: {
    root: 'root',
    content: 'content',
    textContent: 'textContent',
    centered: 'centered',
    subtitle: 'subtitle',
    title: 'title',
    text: 'text',
    contentLink: 'contentLink',
    media: 'media',
  },
}));

const mockedUseMessages = vi.mocked(useMessages);

describe('Banner', () => {
  const baseProps: BannerProps = {
    title: 'Welcome to the site',
    subtitle: 'A short subtitle',
    text: 'This is the banner body copy.',
    image: undefined,
    button: {
      url: '/learn-more',
      text: 'Learn more',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseMessages.mockImplementation((key) => {
      if (key !== 'global') {
        throw new Error(`Unexpected key: ${String(key)}`);
      }
      return {
        readMore: 'Read more',
      } as LibraryMessages['global'];
    });
  });

  it('renders the subtitle, title, text and button text', () => {
    render(<Banner {...baseProps} />);

    expect(screen.getByText('A short subtitle')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Welcome to the site' })
    ).toBeInTheDocument();
    expect(screen.getByText('This is the banner body copy.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Learn more' })).toBeInTheDocument();
  });

  it('uses the primary button variant', () => {
    render(<Banner {...baseProps} />);

    expect(screen.getByRole('button', { name: 'Learn more' })).toHaveAttribute(
      'data-variant',
      'primary'
    );
  });

  it('calls useMessages with global', () => {
    render(<Banner {...baseProps} />);

    expect(mockedUseMessages).toHaveBeenCalledWith('global');
  });

  it('does not render an image when image is undefined', () => {
    render(<Banner {...baseProps} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders a decorative image when image is provided', () => {
    const { container } = render(
      <Banner
        {...baseProps}
        image="/banner.jpg"
      />
    );

    const image = container.querySelector('img');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/banner.jpg');
    expect(image).toHaveAttribute('alt', '');
  });

  it('sets the text grid item spanMd to 2 when there is no image', () => {
    render(<Banner {...baseProps} />);

    const gridItems = screen.getAllByTestId('grid-item');
    expect(gridItems).toHaveLength(1);
    expect(gridItems[0]).toHaveAttribute('data-span', '2');
    expect(gridItems[0]).toHaveAttribute('data-span-md', '2');
  });

  it('sets the text grid item spanMd to 1 when there is an image', () => {
    render(
      <Banner
        {...baseProps}
        image="/banner.jpg"
      />
    );

    const gridItems = screen.getAllByTestId('grid-item');
    expect(gridItems[0]).toHaveAttribute('data-span-md', '1');
  });

  it('renders the media grid item when there is an image', () => {
    render(
      <Banner
        {...baseProps}
        image="/banner.jpg"
      />
    );

    const gridItems = screen.getAllByTestId('grid-item');
    expect(gridItems[1]).toHaveAttribute('data-span', '2');
    expect(gridItems[1]).toHaveAttribute('data-span-md', '1');
  });

  it('falls back to translated read more when button text is undefined', () => {
    render(
      <Banner
        {...baseProps}
        button={{ url: '/learn-more', text: undefined }}
      />
    );

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument();
  });

  it('falls back to translated read more when button text is empty', () => {
    render(
      <Banner
        {...baseProps}
        button={{ url: '/learn-more', text: '' }}
      />
    );

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument();
  });

  it('renders an empty heading when title is empty', () => {
    render(
      <Banner
        {...baseProps}
        title=""
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('passes expected props to layout primitives', () => {
    render(
      <Banner
        {...baseProps}
        image="/banner.jpg"
      />
    );

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toHaveAttribute('data-cols', '2');
    expect(screen.getByTestId('section')).toBeInTheDocument();
    expect(screen.getByTestId('stack')).toHaveAttribute('data-gap', 'sm');
  });
});
