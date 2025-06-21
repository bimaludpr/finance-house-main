import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css"; // Optional: custom styles

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  onPageChange,
}) => {
  return (
    <div className="d-flex justify-content-end mt-2">
      <ReactPaginate
        previousLabel="&laquo;"
        nextLabel="&raquo;"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        pageCount={pageCount}
        forcePage={page}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={(selectedItem) => onPageChange(selectedItem.selected)}
        containerClassName="pagination"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        disabledClassName="disabled"
      />
    </div>
  );
};

export default Pagination;
