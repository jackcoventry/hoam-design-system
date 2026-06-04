import { Accordion, AccordionItem } from '@/components/Accordion';
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
  /** Optional class applied to the tabs root. */
  className?: string;
};

export function Tabs({ title, items, layout, mode, className }: Readonly<TabsProps>) {
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.UP.MD})`);

  if (!isDesktop) {
    return (
      <section
        aria-label={title}
        className={className}
      >
        <Accordion showToggleAll={false}>
          {items.map((tab) => (
            <AccordionItem
              key={tab.id}
              id={tab.id}
              title={tab.label}
            >
              {tab.content}
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
      {...(className === undefined ? {} : { className })}
      {...(layout === undefined ? {} : { layout })}
      {...(mode === undefined ? {} : { mode })}
    />
  );
}
