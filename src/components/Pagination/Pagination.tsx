import { Button } from '@/components/Button';

import styles from '@/components/Pagination/Pagination.module.css';

export type PaginationProps = {
  pageCount?: number;
  currentPage?: number;
};

export function Pagination({ pageCount = 6, currentPage = 1 }: Readonly<PaginationProps>) {
  return (
    <div className={styles.root}>
      <ul className={styles.list}>
        <li>
          <Button
            icon="arrow-left"
            iconOnly
          >
            Previous
          </Button>
        </li>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <Button variant={page === currentPage ? 'primary' : 'secondary'}>{page}</Button>
          </li>
        ))}
        <li>
          <Button
            icon="arrow-right"
            iconOnly
          >
            Next
          </Button>
        </li>
      </ul>
    </div>
  );
}
