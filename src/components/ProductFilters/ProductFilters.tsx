import { PropsWithChildren, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { Accordion, AccordionHeader, AccordionItem, AccordionPanel } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Select } from '@/components/Form/Select/Select';
import { Stack } from '@/components/Layout';
import { Spinner } from '@/components/Loading';
import { FilterBarOptionPanel } from '@/components/ProductFilters/FilterBarOptionPanel';
import { FilterBarRangePanel } from '@/components/ProductFilters/FilterBarRangePanel';
import type { FilterBarProps } from '@/components/ProductFilters/ProductFilters.types';
import {
  buildChips,
  clearGroup,
  getSelectedCount,
  isOptionGroup,
  isRangeGroup,
  setRangeValue,
  toggleOptionSelection,
} from '@/components/ProductFilters/ProductFilters.utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/ProductFilters/ProductFilters.module.css';

export function FilterBar(props: PropsWithChildren<FilterBarProps>) {
  const t = useMessages('productFilters');
  const {
    title = t.title,
    groups,
    value,
    onChange,
    onClearAll,
    className,
    sortLabel = t.sortBy,
    sortOptions,
    sortValue = '',
    onSortChange,
    loading = false,
    children,
  } = props;

  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chips = useMemo(() => buildChips(groups, value), [groups, value]);
  const isMobile = useMediaQuery('(max-width: 48rem)'); // TODO: can this be tokenized?
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
            {t.toggle}
          </Button>
          {chips.length > 0 ? (
            <Button
              onClick={onClearAll}
              size="small"
            >
              {t.reset}
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
                              {t.clear}
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
            aria-label={t.active}
          >
            {chips.length > 0 ? <span className={styles.chipLabel}>{t.active}: </span> : null}
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
                    aria-label={`${t.remove} ${chip.label}`}
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
