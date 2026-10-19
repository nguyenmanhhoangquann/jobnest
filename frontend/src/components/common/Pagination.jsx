import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ page = 1, totalPages = 1, onChange, alwaysShow = false }) {
  if (totalPages <= 1 && !alwaysShow) return null;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    if (onChange) {
      onChange(newPage);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // Số trang hiển thị quanh trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (
        (i === page - delta - 1 && i > 1) ||
        (i === page + delta + 1 && i < totalPages)
      ) {
        pages.push('...');
      }
    }

    // Deduplicate consecutive ellipses
    return pages.filter((item, index) => item !== '...' || pages[index - 1] !== '...');
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="pagination-wrapper d-flex justify-content-center align-items-center gap-1 my-4" aria-label="Phân trang việc làm">
      {/* Nút Trước */}
      <button
        type="button"
        className="page-btn page-btn--nav"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        aria-label="Trang trước"
      >
        <FaChevronLeft size={12} className="me-1" /> Trước
      </button>

      {/* Các nút số */}
      {pageNumbers.map((p, idx) => {
        if (p === '...') {
          return (
            <span key={`ellipsis-${idx}`} className="page-ellipsis px-2 text-muted">
              …
            </span>
          );
        }

        const isCurrent = p === page;
        return (
          <button
            key={`page-${p}`}
            type="button"
            className={`page-btn page-btn--number ${isCurrent ? 'page-btn--active' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </button>
        );
      })}

      {/* Nút Sau */}
      <button
        type="button"
        className="page-btn page-btn--nav"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
        aria-label="Trang sau"
      >
        Sau <FaChevronRight size={12} className="ms-1" />
      </button>
    </nav>
  );
}
