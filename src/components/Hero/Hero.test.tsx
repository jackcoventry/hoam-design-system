import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { HeroSlideProps } from '@/components/Hero';
import { Hero } from '@/components/Hero';

vi.mock('@/components/Hero/Hero.module.css', () => ({
  default: {
    root: 'root',
  },
}));

type MockCarouselProps = {
  slides: HeroSlideProps[];
  getSlideKey: (item: HeroSlideProps) => string;
  renderSlide: (item: HeroSlideProps) => ReactNode;
  pagination?: boolean;
  loop?: boolean;
  autoplay?: {
    delay?: number;
    disableOnInteraction?: boolean;
  };
  'aria-label'?: string;
  effect?: 'slide' | 'fade';
};

type MockHeroSlideProps = HeroSlideProps;

const capturedCarouselProps: MockCarouselProps[] = [];
const capturedHeroSlideProps: MockHeroSlideProps[] = [];

vi.mock('@/components/Carousel', () => ({
  Carousel: (props: MockCarouselProps) => {
    capturedCarouselProps.push(props);
    return <div data-testid="carousel" />;
  },
}));

vi.mock('./HeroSlide', () => ({
  HeroSlide: (props: MockHeroSlideProps) => {
    capturedHeroSlideProps.push(props);
    return <div data-testid="hero-slide" />;
  },
}));

describe('Hero', () => {
  const baseItem: HeroSlideProps = {
    id: '1',
    title: 'Title',
    subtitle: 'Subtitle',
    text: 'Text',
    button: {
      url: '/test',
      text: 'Click me',
    },
  };

  const getCarouselProps = (): MockCarouselProps => {
    const props = capturedCarouselProps[0];

    if (!props) {
      throw new Error('Expected Carousel to be rendered once');
    }

    return props;
  };

  const getHeroSlideProps = (): MockHeroSlideProps => {
    const props = capturedHeroSlideProps[0];

    if (!props) {
      throw new Error('Expected HeroSlide to be rendered once');
    }

    return props;
  };

  beforeEach(() => {
    capturedCarouselProps.length = 0;
    capturedHeroSlideProps.length = 0;
  });

  it('returns null when no items are provided', () => {
    const { container } = render(<Hero items={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders a single HeroSlide when only one item is provided', () => {
    render(<Hero items={[baseItem]} />);

    expect(screen.getByTestId('hero-slide')).toBeInTheDocument();
    expect(capturedHeroSlideProps).toHaveLength(1);
    expect(capturedCarouselProps).toHaveLength(0);
  });

  it('passes the correct props to HeroSlide when only one item is provided', () => {
    render(<Hero items={[baseItem]} />);

    expect(getHeroSlideProps()).toEqual(baseItem);
  });

  it('renders Carousel when multiple items are provided', () => {
    render(<Hero items={[baseItem, { ...baseItem, id: '2' }]} />);

    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(capturedCarouselProps).toHaveLength(1);
    expect(capturedHeroSlideProps).toHaveLength(0);
  });

  it('passes the expected props to Carousel', () => {
    render(
      <Hero
        items={[baseItem, { ...baseItem, id: '2' }]}
        aria-label="Custom label"
      />
    );

    const props = getCarouselProps();

    expect(props.slides).toEqual([baseItem, { ...baseItem, id: '2' }]);
    expect(props.pagination).toBe(true);
    expect(props.loop).toBe(true);
    expect(props.autoplay).toEqual({ delay: 6000 });
    expect(props['aria-label']).toBe('Custom label');
    expect(props.effect).toBe('fade');
  });

  it('uses the item id for getSlideKey', () => {
    render(<Hero items={[baseItem, { ...baseItem, id: '2' }]} />);

    const props = getCarouselProps();

    expect(props.getSlideKey(baseItem)).toBe('1');
    expect(props.getSlideKey({ ...baseItem, id: '2' })).toBe('2');
  });

  it('renders HeroSlide from renderSlide', () => {
    render(<Hero items={[baseItem, { ...baseItem, id: '2' }]} />);

    const props = getCarouselProps();
    const rendered = props.renderSlide(baseItem);

    expect(rendered).toBeTruthy();
  });

  it('uses the default aria-label when none is provided', () => {
    render(<Hero items={[baseItem, { ...baseItem, id: '2' }]} />);

    const props = getCarouselProps();

    expect(props['aria-label']).toBe('Hero carousel');
  });

  it('applies the root class when rendering the carousel branch', () => {
    const { container } = render(<Hero items={[baseItem, { ...baseItem, id: '2' }]} />);

    expect(container.firstChild).toHaveClass('root');
  });
});
