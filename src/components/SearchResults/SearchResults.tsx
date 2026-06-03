import clsx from 'clsx';

import { Pagination } from '@/components/Pagination';
import { useMessages } from '@/hooks/useMessages';

import styles from '@/components/SearchResults/SearchResults.module.css';

export type SearchResultItem = {
  /** Optional stable identifier for the result item. */
  id?: number;
  /** Result title shown in the list. */
  title: string;
  /** Destination opened by the result action. */
  url: string;
  /** Short preview text shown under the result title. */
  preview: string;
};

export type SearchResultsProps = {
  /** Search results rendered in the list. */
  items: SearchResultItem[];
  /** Optional class applied to the search results root. */
  className?: string;
};

export function SearchResult({
  title,
  url,
  preview,
}: Readonly<SearchResultItem & { index?: number }>) {
  return (
    <article className={styles.card}>
      <a
        href={url}
        className={styles.link}
      >
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.preview}>{preview}</p>
      </a>
    </article>
  );
}

export function SearchResults({ items, className }: Readonly<SearchResultsProps>) {
  const t = useMessages('searchForm');

  if (items.length === 0) {
    return (
      <div className={clsx(styles.empty, className)}>
        <p>{t.noResults}</p>
      </div>
    );
  }

  return (
    <div className={clsx(styles.root, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li
            className={styles.item}
            key={item.id ?? `${item.url}-${index}`}
          >
            <SearchResult
              title={item.title}
              preview={item.preview}
              url={item.url}
              index={index}
            />
          </li>
        ))}
      </ol>
      <div className={styles.pagination}>
        <Pagination currentPage={1} />
      </div>
    </div>
  );
}
