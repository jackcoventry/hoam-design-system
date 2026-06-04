import { Meta, StoryObj } from '@storybook/react-vite';

import { BlogArticle, BlogArticleProps } from '@/components/BlogArticle';
import SocialLinks from '@/mocks/socialLinks';
import { NewsletterBannerDemo } from '@/stories/components/NewsletterBannerDemo';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta<typeof BlogArticle> = {
  title: 'Pages/Article Page',
  component: BlogArticle,
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    backgrounds: { value: 'light' },
  },
  args: {
    category: 'Coffee Knowledge',
    title: 'How to Choose the Right Coffee Roast',
    summary:
      'A practical guide to roast level, origin, grind size, and brew method for better coffee at home.',
    author: {
      name: 'Maya Hart',
      id: 'maya-hart',
      image: 'https://placehold.co/20x20',
    },
    profileLink: '/',
    publishDate: 'November 27 2025',
    readingTime: 7,
    image: {
      src: '/hero/banner-3.webp',
      alt: 'A festive scene featuring an array of coffee products',
      caption: 'Freshly roasted coffee, brewing tools, and seasonal gifts ready for dispatch.',
    },
    socialLinks: SocialLinks,
  },
  argTypes: {
    image: {
      table: { disable: true },
    },
    socialLinks: {
      table: { disable: true },
    },
  },
};
export default meta;

type Story = StoryObj<typeof BlogArticle>;

function StoryTemplate({
  title,
  category,
  summary,
  author,
  profileLink,
  publishDate,
  readingTime,
  image,
  socialLinks,
}: Readonly<BlogArticleProps>) {
  return (
    <BaseTemplate>
      <BlogArticle
        title={title}
        category={category}
        summary={summary}
        author={author}
        profileLink={profileLink}
        publishDate={publishDate}
        readingTime={readingTime}
        image={image}
        socialLinks={socialLinks}
      >
        <p>Choosing coffee gets easier when you start with how you brew.</p>

        <p>
          Espresso, filter, French press, and cold brew all reward slightly different roast profiles
          and grind sizes. A <strong>medium roast</strong> is a reliable everyday choice for most
          brewers. It keeps enough sweetness and body for milk drinks while preserving the origin
          character that makes black coffee interesting. <em>Lighter roasts</em> tend to feel
          brighter and more aromatic.
        </p>
        <p>
          If you like chocolate, caramel, and toasted nut notes, start with espresso blends or
          washed Central American coffees. For citrus, florals, and tea-like cups, look at African
          filter roasts and <a href="#test">single-origin releases</a>.
        </p>

        <h2>Start With Your Brew Method</h2>
        <p>
          Espresso benefits from body and sweetness, so blends and medium roasts are forgiving.
          Pour-over highlights clarity, so lighter single origins can show more detail.
        </p>

        <h3>Key Points</h3>
        <ul>
          <li>Choose espresso blends for milk drinks and consistent daily brewing.</li>
          <li>Choose filter roasts for brighter acidity and more origin character.</li>
          <li>Choose whole bean when possible, then grind just before brewing.</li>
        </ul>

        <p>
          Freshness matters too. Coffee usually tastes best after a short resting period and before
          it has spent too long exposed to air, heat, or sunlight.
        </p>

        <h2>Read Tasting Notes Practically</h2>
        <p>
          Tasting notes are not added flavours. They describe the impression a coffee gives when it
          is roasted and brewed well, much like notes on wine or chocolate.
        </p>

        <blockquote>
          “If a coffee sounds like something you already enjoy, it is usually a good place to
          start.”
        </blockquote>

        <p>
          Notes such as chocolate and caramel often point to a rounder cup. Citrus and berry notes
          usually signal more acidity. Floral notes tend to appear in cleaner filter roasts.
        </p>

        <h3>Simple Selection Steps</h3>
        <ol>
          <li>Pick your main brew method.</li>
          <li>Choose a roast level that suits that method.</li>
          <li>Select tasting notes that match flavours you already like.</li>
        </ol>

        <h2>Keep Notes and Adjust</h2>
        <p>
          Once you have a bag open, note grind size, dose, water temperature, and brew time. Small
          adjustments can make the same coffee taste sweeter, brighter, or more balanced.
        </p>
        <p>
          When in doubt, start with a medium roast and a simple recipe. From there, explore lighter
          origins, richer espresso blends, and decaf options with confidence.
        </p>
      </BlogArticle>
      <NewsletterBannerDemo />
    </BaseTemplate>
  );
}

const Template: Story = {
  render: (args) => <StoryTemplate {...args} />,
};

export const Default = { ...Template, args: {} };
