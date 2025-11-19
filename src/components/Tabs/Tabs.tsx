import React, { Activity, Suspense, useState } from 'react';

export type TabConfig = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  title: string;
  items: TabConfig[];
};

function Tabs({ title, items = [] }: Readonly<TabsProps>) {
  const [activeTab, setActiveTab] = useState<string>(items?.[0]?.id);

  return (
    <div className="hoam-tabs">
      <div
        role="tablist"
        aria-label={title}
        className="hoam-tabs__list"
      >
        {items?.map((tab) => {
          const id = tab.id;
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              id={`hoam-tab-${id}`}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`hoam-panel-${id}`}
              onClick={() => setActiveTab(id)}
              data-active={isActive}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <Suspense fallback={<h1>🌀 Loading...</h1>}>
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
                tabIndex={0}
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

export default Tabs;
