import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { DesktopTabs } from '@/components/Tabs';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type Layout = 'horizontal' | 'vertical' | undefined;
type Mode = 'manual' | 'automatic' | undefined;

export type TabProps = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  title: string;
  items: TabProps[];
  layout?: Layout;
  mode?: Mode;
};

export function Tabs({ title, items, layout, mode }: Readonly<TabsProps>) {
  const isMobile = useMediaQuery('(max-width: 600px)');

  if (isMobile) {
    return (
      <section aria-label={title}>
        <Accordion showToggleAll={false}>
          {items.map((tab) => (
            <AccordionItem
              key={tab.id}
              id={tab.id}
            >
              <AccordionHeader>{tab.label}</AccordionHeader>
              <AccordionPanel>{tab.content}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    );
  }

  return (
    <DesktopTabs
      title={title}
      items={items}
      {...(layout === undefined ? {} : { layout })}
      {...(mode === undefined ? {} : { mode })}
    />
  );
}
