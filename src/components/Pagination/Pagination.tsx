import { Button } from '@/components/Button/Button';

import './Pagination.css';

type PaginationProps = {
  pageCount?: number;
  currentPage?: number;
};

function Pagination({ pageCount = 6, currentPage = 1 }: Readonly<PaginationProps>) {
  return (
    <div className="hoam-pagination">
      <ul className="hoam-pagination__list">
        <li>
          <Button
            icon="arrow-left"
            iconOnly
          >
            Previous
          </Button>
        </li>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
          <li
            className="hoam-pagination__pages"
            key={page}
          >
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

export default Pagination;
