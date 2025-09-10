"use client"

import { useRouter, useSearchParams } from 'next/navigation';
import styles from "../../styles/article/article.module.css";

interface CategoryButtonsProps {
  currentCategory: string;
}

export default function CategoryButtons({ currentCategory }: CategoryButtonsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', category);
    params.set('page', '1'); 
    router.push(`/community?${params.toString()}`);
  };

  const categories = [
    { key: 'ALL', label: '전체' },
    { key: 'NOTICE', label: '공지' },
    { key: 'FOOD', label: '먹거리' },
    { key: 'GOODS', label: '굿즈' }
  ];

  return (
    <div className={styles.categoryButtons}>
      {categories.map(({ key, label }) => (
        <button 
          key={key}
          className={`${styles.categoryButton} ${currentCategory === key ? styles.active : ""}`}
          onClick={() => handleCategoryChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}