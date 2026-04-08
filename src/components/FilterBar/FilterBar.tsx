import {
  type ChangeEvent,
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';

import styles from './FilterBar.module.css';

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
};

export type CheckboxGroup = {
  id: string;
  label: string;
  kind: 'checkbox';
  options: readonly FilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
};

export type RadioGroup = {
  id: string;
  label: string;
  kind: 'radio';
  options: readonly FilterOption[];
  searchable?: boolean;
  searchPlaceholder?: string;
};

export type RangeGroup = {
  id: string;
  label: string;
  kind: 'range';
  min: number;
  max: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
};

export type FilterGroup = CheckboxGroup | RadioGroup | RangeGroup;

export type FilterRangeValue = {
  min?: number;
  max?: number;
};

export type FilterValue = {
  options: Record<string, readonly string[]>;
  ranges: Record<string, FilterRangeValue | undefined>;
};

export type FilterBarProps = {
  title?: string;
  groups: readonly FilterGroup[];
  value: FilterValue;
  onChange: (nextValue: FilterValue) => void;
  onApply?: (value: FilterValue) => void;
  onClearAll?: () => void;
  className?: string;
  stackAt?: 'sm' | 'md' | 'lg';
};

type ActiveChip = {
  key: string;
  groupId: string;
  groupLabel: string;
  label: string;
  onRemove: () => void;
};

function isCheckboxGroup(group: FilterGroup): group is CheckboxGroup {
  return group.kind === 'checkbox';
}

function isRadioGroup(group: FilterGroup): group is RadioGroup {
  return group.kind === 'radio';
}

function isRangeGroup(group: FilterGroup): group is RangeGroup {
  return group.kind === 'range';
}

function isSearchableGroup(group: FilterGroup): group is CheckboxGroup | RadioGroup {
  return !isRangeGroup(group) && Boolean(group.searchable);
}

function getOptionSelections(value: FilterValue, groupId: string): readonly string[] {
  return value.options[groupId] ?? [];
}

function isOptionSelected(value: FilterValue, groupId: string, optionId: string): boolean {
  return getOptionSelections(value, groupId).includes(optionId);
}

function toggleOptionSelection(
  value: FilterValue,
  group: CheckboxGroup | RadioGroup,
  optionId: string
): FilterValue {
  const current = getOptionSelections(value, group.id);
  const isSelected = current.includes(optionId);

  if (group.kind === 'radio') {
    return {
      ...value,
      options: {
        ...value.options,
        [group.id]: isSelected ? [] : [optionId],
      },
    };
  }

  return {
    ...value,
    options: {
      ...value.options,
      [group.id]: isSelected ? current.filter((id) => id !== optionId) : [...current, optionId],
    },
  };
}

function clearGroup(value: FilterValue, group: FilterGroup): FilterValue {
  if (isRangeGroup(group)) {
    return {
      ...value,
      ranges: {
        ...value.ranges,
        [group.id]: {},
      },
    };
  }

  return {
    ...value,
    options: {
      ...value.options,
      [group.id]: [],
    },
  };
}

function setRangeValue(
  value: FilterValue,
  groupId: string,
  nextRange: FilterRangeValue
): FilterValue {
  return {
    ...value,
    ranges: {
      ...value.ranges,
      [groupId]: nextRange,
    },
  };
}

function getRangeValue(value: FilterValue, groupId: string): FilterRangeValue | undefined {
  return value.ranges[groupId];
}

function clamp(input: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, input));
}

function getSelectedCount(group: FilterGroup, value: FilterValue): number {
  if (isRangeGroup(group)) {
    const range = getRangeValue(value, group.id);
    return range?.min != null || range?.max != null ? 1 : 0;
  }

  return getOptionSelections(value, group.id).length;
}

function formatRangeChip(group: RangeGroup, range: FilterRangeValue): string {
  const hasMin = typeof range.min === 'number';
  const hasMax = typeof range.max === 'number';

  if (hasMin && hasMax) {
    return `£${range.min}–£${range.max}`;
  }

  if (hasMin) {
    return `From £${range.min}`;
  }

  if (hasMax) {
    return `Up to £${range.max}`;
  }

  return group.label;
}

function buildChips(
  groups: readonly FilterGroup[],
  value: FilterValue,
  onChange: (nextValue: FilterValue) => void
): ActiveChip[] {
  const chips: ActiveChip[] = [];

  for (const group of groups) {
    if (isRangeGroup(group)) {
      const range = getRangeValue(value, group.id);

      if (range && (range.min != null || range.max != null)) {
        chips.push({
          key: `${group.id}-range`,
          groupId: group.id,
          groupLabel: group.label,
          label: formatRangeChip(group, range),
          onRemove: () => {
            onChange(setRangeValue(value, group.id, {}));
          },
        });
      }

      continue;
    }

    const selectedIds = getOptionSelections(value, group.id);

    for (const optionId of selectedIds) {
      const option = group.options.find((item) => item.id === optionId);

      if (!option) {
        continue;
      }

      chips.push({
        key: `${group.id}-${option.id}`,
        groupId: group.id,
        groupLabel: group.label,
        label: option.label,
        onRemove: () => {
          onChange(toggleOptionSelection(value, group, option.id));
        },
      });
    }
  }

  return chips;
}

function matchesSearch(option: FilterOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.trim().toLowerCase());
}

function getStackBreakpointValue(stackAt: 'sm' | 'md' | 'lg'): number {
  switch (stackAt) {
    case 'sm':
      return 640;
    case 'lg':
      return 1024;
    case 'md':
    default:
      return 832;
  }
}

type RangePanelProps = {
  baseId: string;
  group: RangeGroup;
  value: FilterValue;
  onChange: (nextValue: FilterValue) => void;
};

function RangePanel({ baseId, group, value, onChange }: Readonly<RangePanelProps>): JSX.Element {
  const current = getRangeValue(value, group.id);
  const step = group.step ?? 1;

  const minValue = typeof current?.min === 'number' ? current.min : group.min;
  const maxValue = typeof current?.max === 'number' ? current.max : group.max;

  const safeMin = clamp(Math.min(minValue, maxValue), group.min, group.max);
  const safeMax = clamp(Math.max(minValue, maxValue), group.min, group.max);

  const percentageMin = ((safeMin - group.min) / (group.max - group.min)) * 100;
  const percentageMax = ((safeMax - group.min) / (group.max - group.min)) * 100;

  return (
    <div className={styles.rangePanelBody}>
      <div className={styles.rangeInputs}>
        <label className={styles.rangeField}>
          <span className={styles.rangeFieldLabel}>Min</span>
          <input
            className={styles.numberInput}
            type="number"
            inputMode="numeric"
            min={group.min}
            max={group.max}
            step={step}
            value={safeMin}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const nextMin = Number(event.currentTarget.value);

              if (Number.isNaN(nextMin)) {
                return;
              }

              onChange(
                setRangeValue(value, group.id, {
                  min: clamp(nextMin, group.min, safeMax),
                  max: safeMax,
                })
              );
            }}
          />
        </label>

        <label className={styles.rangeField}>
          <span className={styles.rangeFieldLabel}>Max</span>
          <input
            className={styles.numberInput}
            type="number"
            inputMode="numeric"
            min={group.min}
            max={group.max}
            step={step}
            value={safeMax}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const nextMax = Number(event.currentTarget.value);

              if (Number.isNaN(nextMax)) {
                return;
              }

              onChange(
                setRangeValue(value, group.id, {
                  min: safeMin,
                  max: clamp(nextMax, safeMin, group.max),
                })
              );
            }}
          />
        </label>
      </div>

      <div className={styles.dualSlider}>
        <div
          className={styles.sliderTrack}
          aria-hidden="true"
        >
          <div
            className={styles.sliderRange}
            style={{
              left: `${percentageMin}%`,
              right: `${100 - percentageMax}%`,
            }}
          />
        </div>

        <label
          className={styles.visuallyHidden}
          htmlFor={`${baseId}-${group.id}-min`}
        >
          Minimum {group.label}
        </label>
        <input
          id={`${baseId}-${group.id}-min`}
          className={clsx(styles.slider, styles.sliderThumbMin)}
          type="range"
          min={group.min}
          max={group.max}
          step={step}
          value={safeMin}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextMin = Number(event.currentTarget.value);

            onChange(
              setRangeValue(value, group.id, {
                min: clamp(nextMin, group.min, safeMax),
                max: safeMax,
              })
            );
          }}
        />

        <label
          className={styles.visuallyHidden}
          htmlFor={`${baseId}-${group.id}-max`}
        >
          Maximum {group.label}
        </label>
        <input
          id={`${baseId}-${group.id}-max`}
          className={clsx(styles.slider, styles.sliderThumbMax)}
          type="range"
          min={group.min}
          max={group.max}
          step={step}
          value={safeMax}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const nextMax = Number(event.currentTarget.value);

            onChange(
              setRangeValue(value, group.id, {
                min: safeMin,
                max: clamp(nextMax, safeMin, group.max),
              })
            );
          }}
        />
      </div>

      <div
        className={styles.rangeSummary}
        aria-live="polite"
      >
        <span>{group.minLabel ?? `£${group.min}`}</span>
        <span>
          Selected: £{safeMin} – £{safeMax}
        </span>
        <span>{group.maxLabel ?? `£${group.max}`}</span>
      </div>
    </div>
  );
}

export function FilterBar({
  title = 'Filter products',
  groups,
  value,
  onChange,
  onApply,
  onClearAll,
  className,
  stackAt = 'md',
}: Readonly<FilterBarProps>): JSX.Element {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [isStacked, setIsStacked] = useState<boolean>(false);

  const chips = useMemo(() => buildChips(groups, value, onChange), [groups, value, onChange]);

  useEffect(() => {
    const breakpoint = getStackBreakpointValue(stackAt);

    function updateIsStacked(): void {
      setIsStacked(window.innerWidth <= breakpoint);
    }

    updateIsStacked();
    window.addEventListener('resize', updateIsStacked, { passive: true });

    return () => {
      window.removeEventListener('resize', updateIsStacked);
    };
  }, [stackAt]);

  useEffect(() => {
    if (!openGroupId) {
      return;
    }

    function handlePointerDown(event: MouseEvent): void {
      const root = rootRef.current;
      const target = event.target;

      if (!(target instanceof Node) || !root) {
        return;
      }

      if (!root.contains(target)) {
        setOpenGroupId(null);
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        setOpenGroupId(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openGroupId]);

  function closePanel(groupId?: string): void {
    setOpenGroupId(null);

    const targetId = groupId ?? openGroupId;
    if (!targetId) {
      return;
    }

    triggerRefs.current.get(targetId)?.focus();
  }

  const handleTriggerKeyDown =
    (groupId: string) =>
    (event: ReactKeyboardEvent<HTMLButtonElement>): void => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpenGroupId((current) => (current === groupId ? null : groupId));
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel(groupId);
      }
    };

  return (
    <div
      ref={rootRef}
      className={clsx(styles.root, styles[`stackAt${stackAt}`], className)}
    >
      <div className={styles.topRow}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.globalActions}>
          {onClearAll ? (
            <button
              type="button"
              className={styles.clearAllButton}
              onClick={onClearAll}
            >
              Clear all
            </button>
          ) : null}

          {onApply ? (
            <button
              type="button"
              className={styles.applyButton}
              onClick={() => {
                onApply(value);

                if (!isStacked) {
                  closePanel();
                }
              }}
            >
              Apply filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={styles.bar}
        role="toolbar"
        aria-label={title}
      >
        {groups.map((group) => {
          const isOpen = openGroupId === group.id;
          const selectedCount = getSelectedCount(group, value);
          const panelId = `${baseId}-${group.id}-panel`;
          const titleId = `${baseId}-${group.id}-title`;
          const query = searchQueries[group.id] ?? '';

          const visibleOptions =
            !isRangeGroup(group) && isSearchableGroup(group)
              ? group.options.filter((option) => matchesSearch(option, query))
              : !isRangeGroup(group)
                ? group.options
                : [];

          return (
            <div
              key={group.id}
              className={styles.group}
            >
              <button
                ref={(element: HTMLButtonElement | null) => {
                  if (element) {
                    triggerRefs.current.set(group.id, element);
                  } else {
                    triggerRefs.current.delete(group.id);
                  }
                }}
                type="button"
                className={clsx(styles.trigger, isOpen && styles.triggerOpen)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpenGroupId((current) => (current === group.id ? null : group.id));
                }}
                onKeyDown={handleTriggerKeyDown(group.id)}
              >
                <span className={styles.triggerLabel}>{group.label}</span>

                {selectedCount > 0 ? (
                  <span className={styles.triggerCount}>{selectedCount}</span>
                ) : null}

                <span
                  className={styles.triggerChevron}
                  aria-hidden="true"
                >
                  {isOpen ? '▴' : '▾'}
                </span>
              </button>

              {isOpen ? (
                <div
                  id={panelId}
                  className={styles.panel}
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby={titleId}
                >
                  <div className={styles.panelHeader}>
                    <h3
                      id={titleId}
                      className={styles.panelTitle}
                    >
                      {group.label}
                    </h3>

                    <div className={styles.panelActions}>
                      <button
                        type="button"
                        className={styles.panelTextButton}
                        onClick={() => {
                          onChange(clearGroup(value, group));
                        }}
                      >
                        Clear
                      </button>

                      <button
                        type="button"
                        className={styles.panelTextButton}
                        onClick={() => {
                          closePanel(group.id);
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>

                  {isRangeGroup(group) ? (
                    <RangePanel
                      baseId={baseId}
                      group={group}
                      value={value}
                      onChange={onChange}
                    />
                  ) : (
                    <fieldset className={styles.fieldset}>
                      <legend className={styles.visuallyHidden}>{group.label}</legend>

                      {isSearchableGroup(group) ? (
                        <div className={styles.searchWrap}>
                          <label
                            className={styles.visuallyHidden}
                            htmlFor={`${baseId}-${group.id}-search`}
                          >
                            Search {group.label}
                          </label>
                          <input
                            id={`${baseId}-${group.id}-search`}
                            className={styles.searchInput}
                            type="search"
                            value={query}
                            placeholder={group.searchPlaceholder ?? `Search ${group.label}`}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                              setSearchQueries((current) => ({
                                ...current,
                                [group.id]: event.currentTarget.value,
                              }));
                            }}
                          />
                        </div>
                      ) : null}

                      <div className={styles.optionList}>
                        {visibleOptions.length > 0 ? (
                          visibleOptions.map((option) => {
                            const inputId = `${baseId}-${group.id}-${option.id}`;
                            const checked = isOptionSelected(value, group.id, option.id);

                            return (
                              <label
                                key={option.id}
                                htmlFor={inputId}
                                className={clsx(
                                  styles.optionRow,
                                  option.disabled && styles.optionRowDisabled
                                )}
                              >
                                <input
                                  id={inputId}
                                  className={styles.input}
                                  type={isRadioGroup(group) ? 'radio' : 'checkbox'}
                                  name={group.id}
                                  value={option.id}
                                  checked={checked}
                                  disabled={option.disabled}
                                  onChange={() => {
                                    onChange(toggleOptionSelection(value, group, option.id));
                                  }}
                                />

                                <span className={styles.optionLabel}>{option.label}</span>

                                {typeof option.count === 'number' ? (
                                  <span className={styles.optionCount}>{option.count}</span>
                                ) : null}
                              </label>
                            );
                          })
                        ) : (
                          <p className={styles.emptyState}>No filters found.</p>
                        )}
                      </div>
                    </fieldset>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {chips.length > 0 ? (
        <div
          className={styles.chips}
          aria-label="Active filters"
        >
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={styles.chip}
              onClick={chip.onRemove}
              aria-label={`Remove ${chip.label} from ${chip.groupLabel}`}
            >
              <span className={styles.chipGroup}>{chip.groupLabel}:</span>
              <span>{chip.label}</span>
              <span
                className={styles.chipRemove}
                aria-hidden="true"
              >
                ×
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
