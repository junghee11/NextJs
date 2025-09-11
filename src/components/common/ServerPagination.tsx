import Link from 'next/link';
import styles from '../../styles/common/pagination.module.css';

interface ServerPaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
}

export default function ServerPagination({ currentPage, totalPages, basePath }: ServerPaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = [];
    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams();
        if (page > 1) {
            params.set('page', page.toString());
        }
        const queryString = params.toString();
        return queryString ? `${basePath}?${queryString}` : basePath;
    };

    return (
        <div className={styles.pagination}>
            {currentPage > 10 && (
                <Link href={createPageUrl(startPage - 1)} className={styles.pageLink}>
                    이전
                </Link>
            )}
            {pageNumbers.map(number => (
                <Link key={number} href={createPageUrl(number)} className={`${styles.pageLink} ${currentPage === number ? styles.active : ''}`}>
                    {number}
                </Link>
            ))}
            {endPage < totalPages && (
                <Link href={createPageUrl(endPage + 1)} className={styles.pageLink}>
                    다음
                </Link>
            )}
        </div>
    );
}