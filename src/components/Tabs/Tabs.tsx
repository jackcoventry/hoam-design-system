import Accordion, { AccordionItem } from '@/components/Accordion/Accordion';
import useMediaQuery from '@/utils/useMediaQuery';
import React, { Activity, KeyboardEvent, Suspense, useRef, useState } from 'react';
import './Tabs.css';

export type TabConfig = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Layout = 'horizontal' | 'vertical';
type Mode = 'manual' | 'automatic';

type TabsProps = {
  title: string;
  items: TabConfig[];
  layout?: Layout;
  mode?: Mode;
};

function DesktopTabs({
  title,
  items = [],
  layout = 'vertical',
  mode = 'manual',
}: Readonly<TabsProps>) {
  const firstId = items[0]?.id ?? null;
  const [activeTab, setActiveTab] = useState<string | null>(firstId);
  const isVertical = layout === 'vertical';
  const isAutomatic = mode === 'automatic';

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!firstId || !items.length) return null;

  const focusTabByIndex = (index: number, opts?: { activate?: boolean }) => {
    if (!items.length) return;
    const normalisedIndex = (index + items.length) % items.length;
    const id = items[normalisedIndex].id;
    const btn = tabRefs.current[id];
    btn?.focus();
    if (opts?.activate) {
      setActiveTab(id);
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number, id: string) => {
    const key = event.key;

    if (key === 'Home') {
      event.preventDefault();
      focusTabByIndex(0, { activate: isAutomatic });
      return;
    }
    if (key === 'End') {
      event.preventDefault();
      focusTabByIndex(items.length - 1, { activate: isAutomatic });
      return;
    }

    if (isVertical) {
      if (key === 'ArrowUp') {
        event.preventDefault();
        focusTabByIndex(index - 1, { activate: isAutomatic });
        return;
      }
      if (key === 'ArrowDown') {
        event.preventDefault();
        focusTabByIndex(index + 1, { activate: isAutomatic });
        return;
      }
    } else {
      if (key === 'ArrowLeft') {
        event.preventDefault();
        focusTabByIndex(index - 1, { activate: isAutomatic });
        return;
      }
      if (key === 'ArrowRight') {
        event.preventDefault();
        focusTabByIndex(index + 1, { activate: isAutomatic });
        return;
      }
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      setActiveTab(id);
    }
  };

  if (!items.length) return null;

  return (
    <div
      className="hoam-tabs"
      data-layout={layout}
      data-mode={mode}
    >
      <div
        role="tablist"
        aria-label={title}
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        className="hoam-tabs__list"
      >
        {items?.map((tab, index) => {
          const id = tab.id;
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              id={`hoam-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={isActive || undefined}
              aria-controls={`hoam-panel-${id}`}
              data-active={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => {
                tabRefs.current[id] = el;
              }}
              onClick={() => setActiveTab(id)}
              onKeyDown={(event) => handleTabKeyDown(event, index, id)}
              className="hoam-tabs__control"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<h1>Loading...</h1>}>
        {items?.map((tab) => {
          const id = tab.id;
          const isActive = activeTab === id;

          return (
            <Activity
              key={id}
              mode={isActive ? 'visible' : 'hidden'}
            >
              <section
                role="tabpanel"
                id={`hoam-panel-${id}`}
                aria-labelledby={`hoam-tab-${id}`}
                hidden={!isActive}
                className="hoam-tabs__panel"
              >
                {tab.content}
              </section>
            </Activity>
          );
        })}
      </Suspense>
    </div>
  );
}

function Tabs(props) {
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
                <div>{tab.label}</div>
                <div>{tab.content}</div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  }

  return <DesktopTabs {...props} />;
}

export default Tabs;
