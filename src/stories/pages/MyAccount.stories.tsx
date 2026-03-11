import { Meta } from '@storybook/react-vite';

import { RichLink } from '@/components/RichLink';
import { SidebarNavigation } from '@/components/SidebarNavigation';
import BaseTemplate from '@/templates/Base';
import RichLinksData from '@/mocks/components/RichLinks';
import SidebarNavigationData from '@/mocks/components/SidebarNavigation';

const meta: Meta = {
  title: 'Pages/Account',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {},
};
export default meta;

const Template = {
  render: () => (
    <BaseTemplate>
      <div className="container">
        <div className="grid">
          <div className="span-12">
            <h1>My Account</h1>
          </div>
        </div>
        <div className="grid | py-2xl">
          <div className="span-12 lg:span-3">
            <SidebarNavigation items={SidebarNavigationData} />
          </div>
          <div className="span-12 lg:span-8 lg:start-5">
            <h2 className="pb-2xl">Welcome back!</h2>
            <div className="container-fluid">
              <div className="grid">
                {RichLinksData?.map((item) => {
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
          </div>
        </div>
      </div>
    </BaseTemplate>
  ),
};

export const Default = { ...Template, args: {} };
