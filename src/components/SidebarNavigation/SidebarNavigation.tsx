import Accordion, { AccordionItem } from '@/components/Accordion/Accordion';
import { Button } from '@/components/Button/Button';
import useMediaQuery from '@/utils/useMediaQuery';
import React, { Activity, Suspense, useState } from 'react';
import './SidebarNavigation.css';

function SidebarNavigation({ items }) {
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
                    <h2 className="hoam-sidebar-navigation__section-title">{item.label}</h2>
                    <div>
                      <ul className="hoam-sidebar-navigation__list">
                        {item?.items.map((child) => (
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
                    </div>
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
        {items?.map((item) => (
          <li
            key={item.id}
            className="hoam-sidebar-navigation__top-level-item"
          >
            <h2 className="hoam-sidebar-navigation__section-title">{item.label}</h2>
            <ul className="hoam-sidebar-navigation__list">
              {item?.items.map((child) => (
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

export default SidebarNavigation;
