import {
  type JSX,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';

import { Button } from '../Button';
import { Select } from '../Form/Select/Select';
import { Stack } from '../Layout';

import type { FilterBarProps } from './FilterBar.types';
import {
  buildChips,
  clearGroup,
  getBreakpointPx,
  getSelectedCount,
  isOptionGroup,
  isRangeGroup,
  setRangeValue,
  toggleOptionSelection,
} from './filterBar.utils';
import { FilterBarOptionPanel } from './FilterBarOptionPanel';
import { FilterBarRangePanel } from './FilterBarRangePanel';

import styles from './FilterBar.module.css';

export function FilterBar({
  title = 'Filter products',
  groups,
  value,
  onChange,
  onApply,
  onClearAll,
  className,
  stackAt = 'md',
  sortLabel = 'Sort by',
  sortOptions,
  sortValue = '',
  onSortChange,
}: Readonly<FilterBarProps>): JSX.Element {
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});
  const [isStacked, setIsStacked] = useState<boolean>(false);

  const chips = useMemo(() => buildChips(groups, value), [groups, value]);

  useEffect(() => {
    const breakpoint = getBreakpointPx(stackAt);
    const mediaQuery = globalThis.matchMedia(`(max-width: ${breakpoint}px)`);

    const updateIsStacked = (matches: boolean): void => {
      setIsStacked(matches);
    };

    updateIsStacked(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent): void => {
      updateIsStacked(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [stackAt]);

  useEffect(() => {
    if (!openGroupId) {
      return;
    }

    const handlePointerDown = (event: MouseEvent): void => {
      const root = rootRef.current;
      const target = event.target;

      if (!(target instanceof Node) || !root) {
        return;
      }

      if (!root.contains(target)) {
        setOpenGroupId(null);
      }
    };

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        const currentOpenGroupId = openGroupId;
        setOpenGroupId(null);
        triggerRefs.current.get(currentOpenGroupId)?.focus();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openGroupId]);

  const closePanel = (groupId?: string): void => {
    const targetGroupId = groupId ?? openGroupId;

    setOpenGroupId(null);

    if (targetGroupId) {
      triggerRefs.current.get(targetGroupId)?.focus();
    }
  };

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
        <div className={styles.topControls}>
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

          <div className={styles.globalActions}>
            {onClearAll ? (
              <Button
                onClick={onClearAll}
                size="small"
              >
                Clear all
              </Button>
            ) : null}

            {onApply ? (
              <Button
                onClick={() => {
                  onApply(value);

                  if (!isStacked) {
                    closePanel();
                  }
                }}
                size="small"
              >
                Apply filters
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <h2 className={styles.title}>{title}</h2>

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

          return (
            <div
              key={group.id}
              className={styles.group}
            >
              <Button
                ref={(element: HTMLButtonElement | null) => {
                  if (element) {
                    triggerRefs.current.set(group.id, element);
                  } else {
                    triggerRefs.current.delete(group.id);
                  }
                }}
                className={clsx(isOpen && styles.triggerOpen)}
                size="small"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpenGroupId((current) => (current === group.id ? null : group.id));
                }}
                onKeyDown={handleTriggerKeyDown(group.id)}
                // icon={isOpen ? 'caret-down' : 'caret-right'}
                variant={isOpen ? 'tertiary' : 'primary'}
              >
                {group.label}

                {/* {selectedCount > 0 ? <span>({selectedCount})</span> : null} */}
              </Button>

              {isOpen ? (
                <div
                  id={panelId}
                  className={styles.panel}
                  role="dialog"
                  aria-modal="false"
                  aria-labelledby={titleId}
                >
                  <Stack>
                    <div className={styles.panelHeader}>
                      <h3
                        id={titleId}
                        className={styles.panelTitle}
                      >
                        {group.label}
                      </h3>

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

                        <Button
                          className={styles.panelTextButton}
                          onClick={() => {
                            closePanel(group.id);
                          }}
                          size="small"
                          variant="tertiary"
                        >
                          Done
                        </Button>
                      </div>
                    </div>

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
                        query={query}
                        onQueryChange={(nextQuery) => {
                          setSearchQueries((current) => ({
                            ...current,
                            [group.id]: nextQuery,
                          }));
                        }}
                        onToggle={(optionId) => {
                          onChange(toggleOptionSelection(value, group, optionId));
                        }}
                      />
                    ) : null}
                  </Stack>
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
          ))}
        </div>
      ) : null}
    </div>
  );
}
