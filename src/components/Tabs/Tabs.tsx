import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { DesktopTabs } from '@/components/Tabs/Desktop';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { BREAKPOINTS } from '@/styles/breakpoints';

type Layout = 'horizontal' | 'vertical' | undefined;
type Mode = 'manual' | 'automatic' | undefined;

export type TabProps = {
  /** Stable identifier used for tab and panel relationships. */
  id: string;
  /** Visible tab label. */
  label: string;
  /** Tab panel content. */
  content: React.ReactNode;
};

export type TabsProps = {
  /** Accessible title for the tab set. */
  title: string;
  /** Tabs rendered by the component. */
  items: TabProps[];
  /** Layout direction for the desktop tab list. */
  layout?: Layout;
  /** Keyboard activation mode for desktop tabs. */
  mode?: Mode;
};

export function Tabs({ title, items, layout, mode }: Readonly<TabsProps>) {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.UP.MD})`);

  if (!isDesktop) {
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
