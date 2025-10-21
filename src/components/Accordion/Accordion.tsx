import clsx from 'clsx';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import './Accordion.css';

/**
 * Accordion component for displaying collapsible sections.
 * Supports controlled and uncontrolled states, multiple open sections,
 * and provides context for AccordionItem components.
 */

export interface AccordionProps {
  accordionTitle?: string; // TODO replace with component composition
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  openIds?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
  children: ReactNode;
}

export interface AccordionItemProps {
  id: string;
  children: ReactNode;
}

interface AccordionContextType {
  openIds: string[];
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

/**
 * Accordion component
 */
export const Accordion: React.FC<AccordionProps> = ({
  accordionTitle,
  allowMultiple = false,
  defaultOpenIds = [],
  openIds: controlledOpenIds,
  onChange,
  className = '',
  children,
}) => {
  // Determine controlled vs uncontrolled
  const isControlled = controlledOpenIds !== undefined;
  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(defaultOpenIds);
  const openIds = isControlled ? controlledOpenIds : internalOpenIds;

  const updateOpenIds = (ids: string[]) => {
    if (isControlled) {
      onChange?.(ids);
    } else {
      setInternalOpenIds(ids);
    }
  };

  const toggle = (id: string) => {
    const isOpen = openIds.includes(id);
    let next: string[];

    if (isOpen) {
      next = openIds.filter((i) => i !== id);
    } else {
      next = allowMultiple ? [...openIds, id] : [id];
    }
    updateOpenIds(next);
  };

  const itemIds: string[] = React.Children.toArray(children)
    .filter((c) => React.isValidElement(c) && (c.type as any).displayName === 'AccordionItem')
    .map((c: any) => c.props.id);
  const allExpanded = itemIds.length > 0 && itemIds.every((id) => openIds.includes(id));

  const classes = clsx('hoam-accordion', className);

  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      <div className={classes}>
        <div className="hoam-accordion__header">
          {accordionTitle && <h2 className="hoam-accordion__title">{accordionTitle}</h2>}
          <button
            type="button"
            className="hoam-accordion__toggle-all"
            onClick={() => updateOpenIds(allExpanded ? [] : itemIds)}
            aria-label={allExpanded ? 'Collapse all sections' : 'Expand all sections'}
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';

/**
 * AccordionItem component
 */
const AccordionItem: React.FC<AccordionItemProps> = ({ id, children }) => {
  const ctx = useContext(AccordionContext);

  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }

  const { openIds, toggle } = ctx;
  const isOpen = openIds?.includes(id);
  const headerId = `accordion-header-${id}`;
  const panelId = `accordion-panel-${id}`;

  return (
    <div className="hoam-accordion__item">
      <h4 className="hoam-accordion__item-title">
        <button
          id={headerId}
          aria-controls={panelId}
          aria-expanded={isOpen}
          onClick={() => toggle(id)}
          className="hoam-accordion__item-title-button"
        >
          {(children as any)[0].props.children}
          <span className="hoam-accordion__icon">
            <svg
              className="icon"
              width="1.25em"
              height="1.25em"
              fill="currentColor"
            >
              <use xlinkHref={`/icons/icons.svg#${isOpen ? 'caret-down' : 'caret-right'}`} />
            </svg>
          </span>
        </button>
      </h4>
      <div
        id={panelId}
        aria-labelledby={headerId}
        hidden={!isOpen}
        className="hoam-accordion__panel"
        data-open={isOpen ? 'true' : 'false'}
      >
        <div className="hoam-accordion__panel-inner">{(children as any)[1].props.children}</div>
      </div>
    </div>
  );
};

AccordionItem.displayName = 'AccordionItem';

/**
 * Sub-component to render an Accordion header.
 * Useful for composition or legacy use.
 */
const AccordionHeader: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    type="button"
    {...props}
  />
);
AccordionHeader.displayName = 'AccordionHeader';

/**
 * Sub-component to render an Accordion panel.
 */
const AccordionPanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    hidden={props.hidden}
    aria-labelledby={props['aria-labelledby']}
    {...props}
  />
);
AccordionPanel.displayName = 'AccordionPanel';

export default Accordion;
export { AccordionHeader, AccordionItem, AccordionPanel };
