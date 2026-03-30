import { classNames } from '@/utils/utils';

interface PaginationComponentProps {
  initialPage: number;
  totalPages: number;
  handlePageClick: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= totalPages).sort((a, b) => a - b);
}

export default function PaginationComponent({
  initialPage,
  totalPages,
  handlePageClick,
}: PaginationComponentProps) {
  if (totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(initialPage, 1), totalPages);
  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="rounded-lg border border-neutral-600 px-3 py-2 text-sm text-neutral-100 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {pages.map((page, index) => {
        const previous = pages[index - 1];
        const needsGap = previous && page - previous > 1;

        return (
          <div key={page} className="flex items-center gap-2">
            {needsGap ? <span className="px-1 text-neutral-500">…</span> : null}
            <button
              type="button"
              onClick={() => handlePageClick(page)}
              className={classNames(
                'rounded-lg border px-3 py-2 text-sm transition',
                page === currentPage
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-neutral-600 text-neutral-100 hover:border-neutral-400',
              )}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="rounded-lg border border-neutral-600 px-3 py-2 text-sm text-neutral-100 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
