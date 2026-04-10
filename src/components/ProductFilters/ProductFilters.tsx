import { PropsWithChildren, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Select } from '@/components/Form/Select/Select';
import { Stack } from '@/components/Layout';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { Spinner } from '../Loading';

import { FilterBarOptionPanel } from './FilterBarOptionPanel';
import { FilterBarRangePanel } from './FilterBarRangePanel';
import type { FilterBarProps } from './ProductFilters.types';
import {
  buildChips,
  clearGroup,
  getSelectedCount,
  isOptionGroup,
  isRangeGroup,
  setRangeValue,
  toggleOptionSelection,
} from './ProductFilters.utils';

import styles from './ProductFilters.module.css';

export function FilterBar({
  title = 'Filter products',
  groups,
  value,
  onChange,
  onClearAll,
  className,
  sortLabel = 'Sort by',
  sortOptions,
  sortValue = '',
  onSortChange,
  loading = false,
  children,
}: PropsWithChildren<FilterBarProps>) {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chips = useMemo(() => buildChips(groups, value), [groups, value]);
  const isMobile = useMediaQuery('(max-width: 48rem)');
  const [filtersCollapsed, setFiltersCollapsed] = useState<boolean>(isMobile);
  const handleFilterCollapse = () => {
    setFiltersCollapsed((current) => !current);
  };

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, className)}
      data-hide-sidebar={`${filtersCollapsed}`}
    >
      <div className={styles.topRow}>
        <div className={styles.titleWrapper}>
          <Button
            onClick={handleFilterCollapse}
            size="small"
            className={styles.filterToggle}
            variant="secondary"
            icon="filter"
          >
            Toggle Filters
          </Button>
          {chips.length > 0 ? (
            <Button
              onClick={onClearAll}
              size="small"
            >
              Reset
            </Button>
          ) : null}
        </div>

        <div className={styles.globalActions}>
          {sortOptions && sortOptions.length > 0 && onSortChange ? (
            <div className={styles.sortControl}>
              <label
                className={styles.sortLabel}
                htmlFor={`${baseId}-sort`}
              >
                {sortLabel}
              </label>

              <Select
                id={`${baseId}-sort`}
                value={sortValue}
                onChange={(nextValue) => {
                  if (typeof nextValue === 'string') {
                    onSortChange(nextValue);
                  }
                }}
              >
                <Select.Placeholder>Select size</Select.Placeholder>
                {sortOptions.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.layout}>
        <div
          className={styles.sidebar}
          role="toolbar"
          aria-label={title}
        >
          <div
            className={styles.accordion}
            aria-hidden={filtersCollapsed}
          >
            <Accordion defaultOpenIds={['price']}>
              {groups.map((group) => {
                const selectedCount = getSelectedCount(group, value);

                return (
                  <AccordionItem
                    key={group.id}
                    id={group.id}
                  >
                    <AccordionHeader>
                      <span className={styles.groupLabel}>{group.label}</span>
                    </AccordionHeader>
                    <AccordionPanel>
                      <Stack>
                        {isRangeGroup(group) ? (
                          <FilterBarRangePanel
                            baseId={baseId}
                            group={group}
                            value={value}
                            onChange={onChange}
                          />
                        ) : isOptionGroup(group) ? (
                          <FilterBarOptionPanel
                            baseId={baseId}
                            group={group}
                            value={value}
                            onToggle={(optionId) => {
                              onChange(toggleOptionSelection(value, group, optionId));
                            }}
                          />
                        ) : null}

                        {selectedCount > 0 ? (
                          <div className={styles.panelActions}>
                            <Button
                              className={styles.panelTextButton}
                              onClick={() => {
                                onChange(clearGroup(value, group));
                              }}
                              size="small"
                            >
                              Clear
                            </Button>
                          </div>
                        ) : null}
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={styles.chips}
            aria-label="Active filters"
          >
            {chips.length > 0 ? <span className={styles.chipLabel}>Active filters: </span> : null}
            {chips.length > 0
              ? chips.map((chip) => (
                  <Button
                    key={chip.key}
                    onClick={() => {
                      const group = groups.find((item) => item.id === chip.groupId);

                      if (!group) {
                        return;
                      }

                      if (isRangeGroup(group)) {
                        onChange(setRangeValue(value, group.id, {}));
                        return;
                      }

                      const option = group.options.find((item) => item.label === chip.label);

                      if (!option) {
                        return;
                      }

                      onChange(toggleOptionSelection(value, group, option.id));
                    }}
                    aria-label={`Remove ${chip.label} from ${chip.groupLabel}`}
                    icon="close"
                    size="small"
                    variant="secondary"
                  >
                    <span className={styles.chipGroup}>{chip.groupLabel}: </span>
                    {chip.label}
                  </Button>
                ))
              : null}
          </div>
          <div className={styles.items}>
            {loading ? (
              <span className={styles.spinnerWrapper}>
                <Spinner />
              </span>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
