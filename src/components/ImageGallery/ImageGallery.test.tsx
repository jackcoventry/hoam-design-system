import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ImageGallery, type ImageGalleryProps } from './ImageGallery';

vi.mock('./ImageGallery.module.css', () => ({
  default: {
    root: 'root',
    img: 'img',
  },
}));

type GalleryImage = NonNullable<ImageGalleryProps['images']>[number];

type MockCarouselProps = {
  slides: GalleryImage[];
  getSlideKey: (item: GalleryImage) => string | number;
  renderSlide: (item: GalleryImage) => ReactNode;
  navigation?: boolean;
  pagination?: boolean;
  loop?: boolean;
  'aria-label'?: string;
};

const capturedCarouselProps: MockCarouselProps[] = [];

vi.mock('@/components/Carousel', () => ({
  Carousel: (props: MockCarouselProps) => {
    capturedCarouselProps.push(props);
    return <div data-testid="carousel" />;
  },
}));

describe('ImageGallery', () => {
  const images: GalleryImage[] = [
    {
      id: '1',
      src: '/image-1.jpg',
      alt: 'First image',
    },
    {
      id: 2,
      src: '/image-2.jpg',
      alt: 'Second image',
    },
  ];

  const getCarouselProps = (): MockCarouselProps => {
    const props = capturedCarouselProps[0];

    if (!props) {
      throw new Error('Expected Carousel to be rendered once');
    }

    return props;
  };

  beforeEach(() => {
    capturedCarouselProps.length = 0;
  });

  it('returns null when images is omitted', () => {
    const { container } = render(<ImageGallery />);

    expect(container.firstChild).toBeNull();
    expect(capturedCarouselProps).toHaveLength(0);
  });

  it('returns null when images is an empty array', () => {
    const { container } = render(<ImageGallery images={[]} />);

    expect(container.firstChild).toBeNull();
    expect(capturedCarouselProps).toHaveLength(0);
  });

  it('renders Carousel when images are provided', () => {
    render(<ImageGallery images={images} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(capturedCarouselProps).toHaveLength(1);
  });

  it('applies the root class when rendering the gallery', () => {
    const { container } = render(<ImageGallery images={images} />);

    expect(container.firstChild).toHaveClass('root');
  });

  it('passes the images as slides to Carousel', () => {
    render(<ImageGallery images={images} />);

    const props = getCarouselProps();

    expect(props.slides).toEqual(images);
  });

  it('passes the expected Carousel feature props', () => {
    render(<ImageGallery images={images} />);

    const props = getCarouselProps();

    expect(props.navigation).toBe(true);
    expect(props.pagination).toBe(true);
    expect(props.loop).toBe(true);
  });

  it('uses the default aria-label when none is provided', () => {
    render(<ImageGallery images={images} />);

    const props = getCarouselProps();

    expect(props['aria-label']).toBe('Image gallery');
  });

  it('passes a custom aria-label to Carousel', () => {
    render(
      <ImageGallery
        images={images}
        aria-label="Product images"
      />
    );

    const props = getCarouselProps();

    expect(props['aria-label']).toBe('Product images');
  });

  it('uses image id for getSlideKey', () => {
    render(<ImageGallery images={images} />);

    const props = getCarouselProps();

    const firstImage = images[0];
    const secondImage = images[1];

    if (!firstImage || !secondImage) {
      throw new Error('Expected image to exist');
    }

    expect(props.getSlideKey(firstImage)).toBe('1');
    expect(props.getSlideKey(secondImage)).toBe(2);
  });

  it('renders an image slide with src, alt and className', () => {
    render(<ImageGallery images={images} />);

    const props = getCarouselProps();
    const firstImage = images[0];
    if (!firstImage) {
      throw new Error('Expected image to exist');
    }

    const { container } = render(<>{props.renderSlide(firstImage)}</>);

    const image = container.querySelector('img');

    if (!(image instanceof HTMLImageElement)) {
      throw new TypeError('Expected an image element');
    }

    expect(image.src).toContain('/image-1.jpg');
    expect(image.alt).toBe('First image');
    expect(image.className).toContain('img');
  });

  it('renders an image slide without alt text when alt is omitted', () => {
    const imageWithoutAlt: GalleryImage = {
      id: '3',
      src: '/image-3.jpg',
    };

    render(<ImageGallery images={[imageWithoutAlt]} />);

    const props = getCarouselProps();
    const { container } = render(<>{props.renderSlide(imageWithoutAlt)}</>);

    const image = container.querySelector('img');

    if (!(image instanceof HTMLImageElement)) {
      throw new TypeError('Expected an image element');
    }

    expect(image.src).toContain('/image-3.jpg');
    expect(image.alt).toBe('');
    expect(image.className).toContain('img');
  });
});
