import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { Button } from '@/components/Button';
import styles from '@/components/SidebarNavigation/SidebarNavigation.module.css';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Activity, Suspense, useState } from 'react';

type ItemProps = {
  id: string;
  href?: string;
  items?: ItemProps[];
  label: string;
};

export type SidebarNavigationProps = {
  items?: ItemProps[] | undefined;
};

export function SidebarNavigation({ items = [] }: Readonly<SidebarNavigationProps>) {
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
                    <AccordionHeader className={styles.sectionTitle}>{item.label}</AccordionHeader>
                    <AccordionPanel>
                      <ul className={styles.list}>
                        {item?.items?.map((child: ItemProps) => (
                          <li key={child.id}>
                            <a
                              href={child.href}
                              className={styles.link}
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
    <nav className={styles.root}>
      <ul className={styles.list}>
        {items?.map((item: ItemProps) => (
          <li
            key={item.id}
            className={styles.topLevelItem}
          >
            <h2 className={styles.sectionTitle}>{item.label}</h2>
            <ul className={styles.list}>
              {item?.items?.map((child) => (
                <li key={child.id}>
                  <a
                    href={child.href}
                    className={styles.link}
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
