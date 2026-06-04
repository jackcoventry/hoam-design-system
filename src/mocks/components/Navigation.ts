import type { NavTopLevelItem } from '@/components/Navigation/types';

const items = [
  {
    id: 'shop',
    label: 'Shop',
    href: '/shop',
    thumbnail: 'https://placehold.co/600x600',
    items: [
      {
        id: 'all-products',
        label: 'All Products',
        href: '/shop/all-products',
        layout: 'list',
        items: [
          {
            id: 'coffee',
            label: 'Coffee',
            href: '/shop/all-products/coffee',
            items: [
              {
                id: 'espresso-blends',
                label: 'Espresso Blends',
                href: '/shop/category/espresso-blends',
              },
              { id: 'filter-coffee', label: 'Filter Coffee', href: '/shop/category/filter-coffee' },
              { id: 'single-origin', label: 'Single Origin', href: '/shop/category/single-origin' },
              {
                id: 'limited-edition',
                label: 'Limited Edition Roasts',
                href: '/shop/category/limited-edition',
              },
              { id: 'decaf-coffee', label: 'Decaf Coffee', href: '/shop/category/decaf-coffee' },
              {
                id: 'coffee-subscriptions',
                label: 'Coffee Subscriptions',
                href: '/shop/category/coffee-subscriptions',
              },
              { id: 'cold-brew', label: 'Cold Brew', href: '/shop/category/cold-brew' },
            ],
          },
          {
            id: 'brewing-equipment',
            label: 'Brewing Equipment',
            href: '/shop/all-products/brewing-equipment',
            items: [
              { id: 'coffee-makers', label: 'Coffee Makers', href: '/shop/category/coffee-makers' },
              {
                id: 'espresso-machines',
                label: 'Espresso Machines',
                href: '/shop/category/espresso-machines',
              },
              { id: 'grinders', label: 'Coffee Grinders', href: '/shop/category/coffee-grinders' },
              { id: 'kettles', label: 'Kettles', href: '/shop/category/kettles' },
              { id: 'filters', label: 'Filters & Papers', href: '/shop/category/filters' },
              { id: 'scales', label: 'Scales & Measuring Tools', href: '/shop/category/scales' },
              { id: 'cups', label: 'Reusable Cups & Tumblers', href: '/shop/category/cups' },
              { id: 'accessories', label: 'Accessories', href: '/shop/category/accessories' },
            ],
          },
          {
            id: 'gifts',
            label: 'Gifts',
            href: '/shop/all-products/gifts',
            items: [
              {
                id: 'coffee-gift-sets',
                label: 'Coffee Gift Sets',
                href: '/shop/category/coffee-gift-sets',
              },
              {
                id: 'christmas-gifts',
                label: 'Christmas Gifts',
                href: '/shop/category/christmas-gifts',
              },
              {
                id: 'halloween-gifts',
                label: 'Halloween Gifts',
                href: '/shop/category/halloween-gifts',
              },
              {
                id: 'gifts-under-10',
                label: 'Gifts Under £10',
                href: '/shop/category/gifts-under-10',
              },
              {
                id: 'gifts-under-20',
                label: 'Gifts Under £20',
                href: '/shop/category/gifts-under-20',
              },
              {
                id: 'gifts-under-50',
                label: 'Gifts Under £50',
                href: '/shop/category/gifts-under-50',
              },
              {
                id: 'starter-kits',
                label: 'Brewing Starter Kits',
                href: '/shop/category/starter-kits',
              },
              {
                id: 'personalised-gifts',
                label: 'Personalised Gifts',
                href: '/shop/category/personalised-gifts',
              },
            ],
          },
          {
            id: 'merchandise',
            label: 'Merchandise',
            href: '/shop/all-products/merchandise',
            items: [
              { id: 'mugs', label: 'Mugs', href: '/shop/category/mugs' },
              {
                id: 'roaster-aprons',
                label: 'Roaster Aprons',
                href: '/shop/category/roaster-aprons',
              },
              { id: 'stickers', label: 'Stickers & Prints', href: '/shop/category/stickers' },
              {
                id: 'coffee-bags',
                label: 'Reusable Coffee Bags',
                href: '/shop/category/coffee-bags',
              },
            ],
          },
        ],
      },
      {
        id: 'new-arrivals',
        label: 'New Arrivals',
        href: '/shop/new-arrivals',
        layout: 'thumbnail',
        items: [
          {
            id: 'spring-specials',
            label: 'Spring Specials',
            href: '/shop/new-arrivals/spring-specials',
            thumbnail: 'https://placehold.co/600x300',
          },
          {
            id: 'summer-specials',
            label: 'Summer Specials',
            href: '/shop/new-arrivals/summer-specials',
            thumbnail: 'https://placehold.co/600x300',
          },
          {
            id: 'seasonal-drinks',
            label: 'Seasonal Drinks',
            href: '/shop/new-arrivals/seasonal-drinks',
            thumbnail: 'https://placehold.co/600x300',
          },
        ],
      },
      {
        id: 'best-sellers',
        label: 'Best Sellers',
        href: '/shop/best-sellers',
        layout: 'thumbnail',
        items: [
          {
            id: 'top-coffee',
            label: 'Top Coffee',
            href: '/shop/best-sellers/top-coffee',
            thumbnail: 'https://placehold.co/600x300',
          },
          {
            id: 'top-equipment',
            label: 'Top Equipment',
            href: '/shop/best-sellers/top-equipment',
            thumbnail: 'https://placehold.co/600x300',
          },
          {
            id: 'top-gifts',
            label: 'Top Gifts',
            href: '/shop/best-sellers/top-gifts',
            thumbnail: 'https://placehold.co/600x300',
          },
          {
            id: 'top-merch',
            label: 'Top Merchandise',
            href: '/shop/best-sellers/top-merch',
            thumbnail: 'https://placehold.co/600x300',
          },
        ],
      },
    ],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    href: '/subscriptions',
  },
  {
    id: 'community',
    label: 'Community',
    href: '/community',
    thumbnail: 'https://placehold.co/600x600',
    items: [
      {
        id: 'our-story',
        label: 'Our Story',
        href: '/our-story',
      },
      {
        id: 'about-us',
        label: 'About Us',
        href: '/our-story/about-us',
      },
      {
        id: 'sustainability',
        label: 'Sustainability',
        href: '/our-story/sustainability',
      },
      {
        id: 'learn',
        label: 'Learn',
        href: '/learn',
        layout: 'list',
        items: [
          {
            id: 'brewing-guides',
            label: 'Brewing Guides',
            href: '/learn/brewing-guides',
            items: [
              { id: 'espresso-guide', label: 'Espresso', href: '/learn/brewing-guides/espresso' },
              { id: 'pourover-guide', label: 'Pour Over', href: '/learn/brewing-guides/pour-over' },
              {
                id: 'french-press-guide',
                label: 'French Press',
                href: '/learn/brewing-guides/french-press',
              },
              {
                id: 'aeropress-guide',
                label: 'AeroPress',
                href: '/learn/brewing-guides/aeropress',
              },
              {
                id: 'cold-brew-guide',
                label: 'Cold Brew',
                href: '/learn/brewing-guides/cold-brew',
              },
            ],
          },
          {
            id: 'coffee-knowledge',
            label: 'Coffee Knowledge',
            href: '/learn/coffee-knowledge',
            items: [
              {
                id: 'beans-101',
                label: 'Coffee Beans 101',
                href: '/learn/coffee-knowledge/beans-101',
              },
              {
                id: 'processing-methods',
                label: 'Processing Methods',
                href: '/learn/coffee-knowledge/processing',
              },
              {
                id: 'origin-stories',
                label: 'Origins & Regions',
                href: '/learn/coffee-knowledge/origins',
              },
              {
                id: 'tasting-notes',
                label: 'Understanding Tasting Notes',
                href: '/learn/coffee-knowledge/tasting-notes',
              },
            ],
          },
          {
            id: 'recipes',
            label: 'Recipes',
            href: '/learn/recipes',
            items: [
              { id: 'iced-coffee', label: 'Iced Coffee', href: '/learn/recipes/iced-coffee' },
              { id: 'mocha', label: 'Mocha', href: '/learn/recipes/mocha' },
              { id: 'latte', label: 'Latte', href: '/learn/recipes/latte' },
            ],
          },
          {
            id: 'equipment-care',
            label: 'Equipment Care',
            href: '/learn/equipment-care',
            items: [
              { id: 'descaling', label: 'Descaling', href: '/learn/equipment-care/descaling' },
              {
                id: 'cleaning-routines',
                label: 'Cleaning Routines',
                href: '/learn/equipment-care/cleaning',
              },
              {
                id: 'grinder-maintenance',
                label: 'Grinder Maintenance',
                href: '/learn/equipment-care/grinder',
              },
            ],
          },
          {
            id: 'barista-skills',
            label: 'Barista Skills',
            href: '/learn/barista-skills',
            items: [
              {
                id: 'milk-texturing',
                label: 'Milk Texturing',
                href: '/learn/barista-skills/milk-texturing',
              },
              {
                id: 'latte-art',
                label: 'Latte Art Basics',
                href: '/learn/barista-skills/latte-art',
              },
            ],
          },
          {
            id: 'sustainability-learn',
            label: 'Sustainability',
            href: '/learn/sustainability',
            items: [
              {
                id: 'ethical-sourcing',
                label: 'Ethical Sourcing',
                href: '/learn/sustainability/sourcing',
              },
              {
                id: 'packaging',
                label: 'Packaging & Recycling',
                href: '/learn/sustainability/packaging',
              },
            ],
          },
        ],
      },
    ],
  },
] satisfies NavTopLevelItem[];

export default items;
