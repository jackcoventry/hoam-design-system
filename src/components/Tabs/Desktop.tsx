import { Activity, type KeyboardEvent, useRef, useState } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import type { TabsProps } from '@/components/Tabs';

import styles from '@/components/Tabs/Tabs.module.css';
import bodyText from '@/styles/BodyText.module.css';

export function DesktopTabs({
  title,
  items,
  layout = 'vertical',
  mode = 'manual',
}: Readonly<TabsProps>) {
  const firstId = items[0]?.id ?? null;
  const [activeTab, setActiveTab] = useState<string | null>(firstId);

  const isVertical = layout === 'vertical';
  const isAutomatic = mode === 'automatic';

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!firstId || items.length === 0) {
    return null;
  }

  const focusTabByIndex = (index: number, options?: { activate?: boolean }) => {
    const normalisedIndex = (index + items.length) % items.length;
    const item = items[normalisedIndex];

    if (!item) {
      return;
    }

    tabRefs.current[item.id]?.focus();

    if (options?.activate) {
      setActiveTab(item.id);
    }
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number, id: string) => {
    const { key } = event;

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

  return (
    <div
      className={styles.root}
      data-layout={layout}
      data-mode={mode}
    >
      <div
        role="tablist"
        aria-label={title}
        aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        className={styles.list}
      >
        {items.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              id={`hoam-tab-${tab.id}`}
              as="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`hoam-panel-${tab.id}`}
              data-active={isActive ? 'true' : 'false'}
              tabIndex={isActive ? 0 : -1}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index, tab.id)}
              className={styles.control}
              variant={isActive ? 'tertiary' : 'secondary'}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>

      {items.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Activity
            key={tab.id}
            mode={isActive ? 'visible' : 'hidden'}
          >
            <section
              role="tabpanel"
              id={`hoam-panel-${tab.id}`}
              aria-labelledby={`hoam-tab-${tab.id}`}
              hidden={!isActive}
              className={clsx(styles.panel, bodyText.root)}
            >
              {tab.content}
            </section>
          </Activity>
        );
      })}
    </div>
  );
}
