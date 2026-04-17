import { HeroSlideProps } from '@/components/Hero/HeroSlide';

const items: HeroSlideProps[] = [
  {
    id: '1',
    title: 'Hoam',
    subtitle: 'Special collection',
    text: 'A test description',
    featuredImage: {
      src: '/hero/range.png',
      alt: '',
    },
    button: {
      url: '/',
      text: 'Read more',
    },
  },
  {
    id: '2',
    title: 'Slide 2',
    subtitle: 'Christmas collection',
    text: 'Another test description',
    featuredImage: {
      src: '/hero/range.png',
      alt: '',
    },
    button: {
      url: '/',
      text: 'Find out more',
    },
  },
  {
    id: '3',
    title: 'Slide 3',
    subtitle: 'Member exclusive',
    text: 'Yet another test description',
    background: {
      kind: 'image',
      src: '/hero/banner-3.webp',
    },
    featuredImage: {
      src: '/hero/range.png',
      alt: '',
    },
    button: {
      url: '/',
      text: 'Join now',
    },
  },
  {
    id: '4',
    title: 'Slide 4',
    subtitle: 'New Arrivals',
    text: 'Check out our new shop',
    background: {
      kind: 'video',
      src: '/hero/hero.mp4',
    },
    button: {
      url: '/',
      text: 'Read more',
    },
  },
];

export default items;
