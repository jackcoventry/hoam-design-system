import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { Button } from '@/components/Button/Button';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Activity, Suspense, useState } from 'react';
import './SidebarNavigation.css';

type ItemProps = {
  id: string;
  label: string;
  href?: string;
  items?: ItemProps[];
};

type Props = {
  items?: ItemProps[] | undefined;
};

export function SidebarNavigation({ items = [] }: Readonly<Props>) {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          icon={isOpen ? 'caret-down' : 'caret-right'}
        >
          {isOpen ? 'Hide navigation' : 'Show navigation'}
        </Button>
        <Suspense fallback={<h1>Loading...</h1>}>
          <Activity mode={isOpen ? 'visible' : 'hidden'}>
            <Accordion>
              {items?.map((item) => {
                return (
                  <AccordionItem
                    key={item.id}
                    id={item.id}
                  >
                    <AccordionHeader className="hoam-sidebar-navigation__section-title">
                      {item.label}
                    </AccordionHeader>
                    <AccordionPanel>
                      <ul className="hoam-sidebar-navigation__list">
                        {item?.items?.map((child: ItemProps) => (
                          <li key={child.id}>
                            <a
                              href={child.href}
                              className="hoam-sidebar-navigation__link"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Activity>
        </Suspense>
      </>
    );
  }

  return (
    <nav className="hoam-sidebar-navigation">
      <ul className="hoam-sidebar-navigation__list">
        {items?.map((item: ItemProps) => (
          <li
            key={item.id}
            className="hoam-sidebar-navigation__top-level-item"
          >
            <h2 className="hoam-sidebar-navigation__section-title">{item.label}</h2>
            <ul className="hoam-sidebar-navigation__list">
              {item?.items?.map((child) => (
                <li key={child.id}>
                  <a
                    href={child.href}
                    className="hoam-sidebar-navigation__link"
                  >
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
