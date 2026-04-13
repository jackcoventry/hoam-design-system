import { Activity, Suspense, useState } from 'react';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Stack } from '@/components/Layout';
import { Spinner } from '@/components/Loading';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMessages } from '@/hooks/useMessages';
import { BREAKPOINTS } from '@/styles/breakpoints';

import styles from '@/components/SidebarNavigation/SidebarNavigation.module.css';

export type ItemProps = {
  id: string;
  href?: string;
  items?: ItemProps[];
  label: string;
};

export type SidebarNavigationProps = {
  items?: ItemProps[];
  ['aria-label']?: string;
  hideLabel?: string;
  showLabel?: string;
};

export function SidebarNavigation(props: Readonly<SidebarNavigationProps>) {
  const t = useMessages('sidebarNavigation');
  const {
    items = [],
    'aria-label': ariaLabel = t.title,
    hideLabel = t.hide,
    showLabel = t.show,
  } = props;

  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.UP.SM})`);
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen((current) => !current);
  }

  if (!isDesktop) {
    return (
      <>
        <Button
          onClick={handleToggle}
          size="small"
          icon={isOpen ? 'caret-down' : 'caret-right'}
        >
          {isOpen ? hideLabel : showLabel}
        </Button>

        <Suspense fallback={<Spinner />}>
          <Activity mode={isOpen ? 'visible' : 'hidden'}>
            <Accordion>
              {items.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                >
                  <AccordionHeader className={styles.sectionTitle}>{item.label}</AccordionHeader>

                  <AccordionPanel>
                    <ul className={styles.list}>
                      {item.items?.map((child) => (
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
              ))}
            </Accordion>
          </Activity>
        </Suspense>
      </>
    );
  }

  return (
    <nav
      className={styles.root}
      aria-label={ariaLabel}
    >
      <ul className={styles.list}>
        {items.map((item) => (
          <li
            key={item.id}
            className={styles.topLevelItem}
          >
            <Stack gap="xs">
              <h2 className={styles.sectionTitle}>{item.label}</h2>

              <ul className={styles.list}>
                {item.items?.map((child) => (
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
            </Stack>
          </li>
        ))}
      </ul>
    </nav>
  );
}
