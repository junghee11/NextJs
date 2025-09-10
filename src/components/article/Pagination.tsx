"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../../styles/article/article.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  category: string;
}

export default function Pagination({ currentPage, totalPages, category }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    params.set('category', category);
    router.push(`/community?${params.toString()}`);
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      {currentPage > 1 && (
        <>
          <button 
            onClick={() => handlePageChange(1)}
            className={styles.pageButton}
          >
            &laquo;
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            className={styles.pageButton}
          >
            &lt;
          </button>
        </>
      )}

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            className={styles.pageButton}
          >
            &gt;
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            className={styles.pageButton}
          >
            &raquo;
          </button>
        </>
      )}
    </div>
  );
}