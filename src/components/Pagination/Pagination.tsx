import { Button } from '@/components/Button';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/Pagination/Pagination.module.css';

type PaginationItem = number | 'ellipsis-left' | 'ellipsis-right';

export type PaginationProps = {
  pageCount?: number;
  currentPage?: number;
  previousLabel?: string;
  nextLabel?: string;
  'aria-label'?: string;
  siblingCount?: number;
  onPageChange?: (page: number) => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getPageRange(start: number, end: number): number[] {
  const length = end - start + 1;

  return Array.from({ length }, (_, index) => start + index);
}

function getPaginationItems(
  pageCount: number,
  currentPage: number,
  siblingCount: number
): PaginationItem[] {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (pageCount <= totalPageNumbers) {
    return getPageRange(1, pageCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, pageCount);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < pageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + siblingCount * 2;
    const leftRange = getPageRange(1, leftItemCount);

    return [...leftRange, 'ellipsis-right', pageCount];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + siblingCount * 2;
    const rightRange = getPageRange(pageCount - rightItemCount + 1, pageCount);

    return [1, 'ellipsis-left', ...rightRange];
  }

  const middleRange = getPageRange(leftSiblingIndex, rightSiblingIndex);

  return [1, 'ellipsis-left', ...middleRange, 'ellipsis-right', pageCount];
}

export function Pagination(props: Readonly<PaginationProps>) {
  const t = useMessages('pagination');

  const {
    pageCount = 6,
    currentPage = 1,
    previousLabel = t.previous,
    nextLabel = t.next,
    'aria-label': ariaLabel = t.title,
    siblingCount = 1,
    onPageChange,
  } = props;
  const safePageCount = Math.max(1, pageCount);
  const safeSiblingCount = Math.max(0, siblingCount);
  const safeCurrentPage = clamp(currentPage, 1, safePageCount);

  const isPreviousDisabled = safeCurrentPage <= 1;
  const isNextDisabled = safeCurrentPage >= safePageCount;

  const items = getPaginationItems(safePageCount, safeCurrentPage, safeSiblingCount);

  function handlePageChange(page: number): void {
    if (page === safeCurrentPage) return;
    onPageChange?.(page);
  }

  function handlePrevious(): void {
    if (isPreviousDisabled) return;
    onPageChange?.(safeCurrentPage - 1);
  }

  function handleNext(): void {
    if (isNextDisabled) return;
    onPageChange?.(safeCurrentPage + 1);
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={styles.root}
    >
      <ul className={styles.list}>
        <li>
          <Button
            icon="arrow-left"
            iconOnly
            disabled={isPreviousDisabled}
            onClick={handlePrevious}
            size="small"
          >
            {previousLabel}
          </Button>
        </li>

        {items.map((item, index) => {
          if (typeof item !== 'number') {
            return (
              <li
                key={`${item}-${index}`}
                aria-hidden="true"
                className={styles.ellipsis}
              >
                <span className={styles.ellipsisText}>…</span>
              </li>
            );
          }

          const isCurrentPage = item === safeCurrentPage;

          return (
            <li key={item}>
              <Button
                aria-current={isCurrentPage ? 'page' : undefined}
                aria-label={
                  isCurrentPage ? t.currentPage(item) : t.goToPage(item)
                }
                disabled={isCurrentPage}
                variant={isCurrentPage ? 'primary' : 'secondary'}
                onClick={() => handlePageChange(item)}
                size="small"
              >
                {item}
              </Button>
            </li>
          );
        })}

        <li>
          <Button
            icon="arrow-right"
            iconOnly
            disabled={isNextDisabled}
            onClick={handleNext}
            size="small"
          >
            {nextLabel}
          </Button>
        </li>
      </ul>
    </nav>
  );
}
