import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { DesktopTabs } from '@/components/Tabs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import './Tabs.css';

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

export function Tabs(props: Readonly<TabsProps>) {
  const isMobile = useMediaQuery('(max-width: 600px)');

  if (isMobile) {
    return (
      <div>
        <Accordion>
          {props?.items?.map((tab) => {
            return (
              <AccordionItem
                key={tab.id}
                id={tab.id}
              >
                <AccordionHeader>{tab.label}</AccordionHeader>
                <AccordionPanel>{tab.content}</AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }

  return <DesktopTabs {...props} />;
}
