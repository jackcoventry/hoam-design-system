import { Meta, StoryObj } from '@storybook/react-vite';

import { BlogArticle } from '@/components/BlogArticle';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import SocialLinks from '@/mocks/socialLinks';
import BaseTemplate from '@/stories/templates/Base';

const meta: Meta<typeof BlogArticle> = {
  title: 'Pages/Article Page',
  component: BlogArticle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  globals: {
    backgrounds: { value: 'light' },
  },
  args: {
    category: 'Lifestyle & Culture',
    title: 'Amet Consectetur Adipiscing',
    summary:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
    author: {
      name: 'Jane Doe',
      id: 'abc',
      image: 'https://placehold.co/20x20',
    },
    publishDate: 'November 27 2025',
    readingTime: 7,
    image: {
      src: '/hero/banner-3.webp',
      alt: 'A festive scene featuring an array of coffee products',
      caption:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.',
    },
    socialLinks: SocialLinks,
  },
};
export default meta;

type Story = StoryObj<typeof BlogArticle>;

const Template: Story = {
  render: (args) => (
    <BaseTemplate>
      <BlogArticle
        title={args.title}
        category={args.category}
        summary={args.summary}
        author={args.author}
        publishDate={args.publishDate}
        readingTime={args.readingTime}
        image={args.image}
        tags={args.tags}
        socialLinks={args.socialLinks}
      >
        <p>
          Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos.
        </p>
        <p>
          Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh
          elementum imperdiet. Duis sagittis ipsum. Praesent mauris.{' '}
          <em>Fusce nec tellus sed augue semper porta</em>. Mauris massa.
        </p>
        <p>
          Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim
          lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.{' '}
          <a href="#test">In scelerisque sem at dolor</a>. Maecenas mattis.
        </p>

        <h2>Subheading: Curabitur Sodales Ligula</h2>
        <p>
          Maecenas faucibus mollis interdum. Praesent commodo cursus magna, vel scelerisque nisl
          consectetur et. Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere
          velit aliquet.
        </p>

        <h3>Key Points</h3>
        <ul>
          <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
          <li>Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</li>
          <li>Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum.</li>
        </ul>

        <p>
          Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed
          consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
        </p>

        <h2>In-Depth Analysis: Aenean Lacinia Bibendum Nulla</h2>
        <p>
          Aenean lacinia bibendum nulla sed consectetur. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac
          facilisis in, egestas eget quam.
        </p>

        <blockquote>
          “Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante
          venenatis dapibus posuere velit aliquet.”
        </blockquote>

        <p>
          Nullam id dolor id nibh ultricies vehicula ut id elit. Nullam quis risus eget urna mollis
          ornare vel eu leo. Maecenas faucibus mollis interdum. Vestibulum id ligula porta felis
          euismod semper.
        </p>

        <h3>Numbered Steps</h3>
        <ol>
          <li>Curabitur blandit tempus porttitor.</li>
          <li>Nullam quis risus eget urna mollis ornare vel eu leo.</li>
          <li>Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</li>
        </ol>

        <h2>Conclusion: Etiam Porta Sem Malesuada</h2>
        <p>
          Etiam porta sem malesuada magna mollis euismod. Donec ullamcorper nulla non metus auctor
          fringilla. Cras mattis consectetur purus sit amet fermentum.
        </p>
        <p>
          Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis.
          Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo.
        </p>
      </BlogArticle>
      <NewsletterBanner
        title="Connect with us"
        description="Sign up to our newsletter to receive the latest news and updates from our team."
        socialLinks={SocialLinks}
      />
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
