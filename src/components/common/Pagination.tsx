import { Pagination } from "@nextui-org/react";

interface PaginationComponentProps {
  initialPage: number;
  totalPages: number;
  handlePageClick: (page: number) => void;
}

export default function PaginationComponent({ initialPage, totalPages, handlePageClick }: PaginationComponentProps) {
  return (
    <Pagination
      isCompact
      variant="light"
      initialPage={initialPage}
      total={totalPages}
      onChange={handlePageClick}
      classNames={{
          wrapper: "bg-opacityLight-5 border border-neutral-600",
          item: "text-neutral-100 hover:!bg-neutral-600",
          cursor: "rounded-lg",
      }}
    />
  )
}