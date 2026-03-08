import { RichLink } from '@/components/RichLink/RichLink';
import MockData from '@/mocks/components/RichLinks';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof RichLink> = {
  title: 'Components/Rich Link',
  component: RichLink,
  tags: ['autodocs'],
  args: {},
};
export default meta;

type Story = StoryObj<typeof RichLink>;

const Template: Story = {
  render: () => {
    return (
      <div className="container">
        <div className="grid">
          {MockData?.map((item) => {
            return (
              <div
                className="span-12 md:span-6 lg:span-4"
                key={item.href}
              >
                <RichLink
                  title={item.title}
                  href={item.href}
                  image={item.image}
                  imageAlt={item.imageAlt}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  },
};

export const Default = { ...Template, args: {} };
