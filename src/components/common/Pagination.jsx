import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 2) {
      pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-12 h-12 rounded-full flex items-center justify-center mr-2 ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600 '
        }`}
        aria-label="Попередня сторінка"
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((pageNumber, index) => (
        <button
          key={index}
          onClick={() => {
            if (pageNumber !== '...') {
              onPageChange(pageNumber);
            }
          }}
          disabled={pageNumber === '...'}
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-1 ${
            pageNumber === currentPage
              ? 'bg-amber-600 text-white font-bold'
              : pageNumber === '...'
              ? 'bg-gray-100 text-gray-500 cursor-default'
              : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600 '
          }`}
          aria-label={
            pageNumber === '...' ? 'Пропуск' : `Сторінка ${pageNumber}`
          }
        >
          {pageNumber}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 rounded-full flex items-center justify-center ml-2 ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-600 '
        }`}
        aria-label="Наступна сторінка"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}
