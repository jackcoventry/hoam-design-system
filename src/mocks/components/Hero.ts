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
    title: 'Seasonal',
    subtitle: 'Limited roast release',
    text: 'Explore coffees with clear tasting notes.',
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
    title: 'Unlimited coffee',
    subtitle: 'Flexible subscriptions',
    text: 'Adjust your delivery schedule whenever your routine changes.',
    background: {
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
];

export default items;
