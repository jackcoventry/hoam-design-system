import { HeroSlideProps } from '@/components/Hero/HeroSlide';

const items: HeroSlideProps[] = [
  {
    id: 'house-espresso',
    title: 'Hoam',
    subtitle: 'Special collection',
    text: 'Coming soon',
    featuredImage: {
      src: '/hero/range.png',
      alt: 'Coffee products and brewing accessories arranged together',
    },
    button: {
      url: '/shop/coffee',
      text: 'Shop coffee',
    },
  },
  {
    id: 'single-origin',
    title: 'Seasonal single origins',
    subtitle: 'Limited roast release',
    text: 'Explore coffees with clear tasting notes, traceable origins, and roast profiles matched to filter and espresso brewing.',
    featuredImage: {
      src: '/hero/range.png',
      alt: 'A seasonal coffee collection displayed with brew equipment',
    },
    button: {
      url: '/shop/category/single-origin',
      text: 'Explore origins',
    },
  },
  {
    id: 'subscription',
    title: 'Never run out of coffee',
    subtitle: 'Flexible subscriptions',
    text: 'Choose espresso, filter, decaf, or roaster selection and adjust your delivery schedule whenever your routine changes.',
    background: {
      kind: 'image',
      src: '/hero/banner-3.webp',
    },
    featuredImage: {
      src: '/hero/range.png',
      alt: 'Subscription coffee bags and seasonal gifts',
    },
    button: {
      url: '/subscriptions',
      text: 'Start a subscription',
    },
  },
  {
    id: 'brew-guides',
    title: 'Brew with confidence',
    subtitle: 'Guides and gear',
    text: 'Find grinders, kettles, filters, and practical recipes for espresso, pour-over, French press, and cold brew.',
    background: {
      kind: 'video',
      src: '/hero/hero.mp4',
    },
    button: {
      url: '/learn/brewing-guides',
      text: 'Read brew guides',
    },
  },
];

export default items;
