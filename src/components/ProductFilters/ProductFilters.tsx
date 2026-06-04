import { PropsWithChildren, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { Accordion, AccordionItem } from '@/components/Accordion';
import { Button } from '@/components/Button';
import { Select } from '@/components/Form/Select/Select';
import { Stack } from '@/components/Layout';
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
import { BREAKPOINTS } from '@/styles/breakpoints';
import { useFormatting } from '@/lib/i18n/formatting/useFormatting';

import styles from '@/components/ProductFilters/ProductFilters.module.css';

export function FilterBar(props: PropsWithChildren<FilterBarProps>) {
  const t = useMessages('productFilters');
  const { locale, currency } = useFormatting();

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
    children,
  } = props;

  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chips = useMemo(
    () =>
      buildChips(groups, value, locale, currency, {
        minimumValueChip: t.minimumValueChip,
        maximumValueChip: t.maximumValueChip,
      }),
    [groups, value, locale, currency, t]
  );
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.UP.MD})`);
  const [filtersCollapsed, setFiltersCollapsed] = useState<boolean>(!isDesktop);
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
                    title={<span className={styles.groupLabel}>{group.label}</span>}
                  >
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
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={styles.chips}
            role="group"
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
                    aria-label={t.removeFilter(chip.label)}
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
          <div className={styles.items}>{children}</div>
        </div>
      </div>
    </div>
  );
}
