"use client"

import Link from "next/link";
import styles from "../../styles/article/article.module.css"
import { getArticleList } from "../../service/community/apis";
import { useState, useEffect } from "react";
import { elapsedTime } from "../../utils/stringFormat/date";
import { imageUrlFormat } from "../../utils/stringFormat/image";

export default function ArticleList() {
    const [articleList, setArticleList] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

    const fetchArticles = async (category: string) => {
        try {
            setLoading(true);
            const data = await getArticleList(category, 1);
            setArticleList(data);
        } catch (error) {
            console.error('게시글 목록 로딩 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    if (loading) {
        return <div className={styles.container}><div style={{textAlign: "center"}}>로딩 중...</div></div>;
    }

    if (!articleList) {
        return <div className={styles.container}><div style={{textAlign: "center"}}>데이터를 불러올 수 없습니다</div></div>;
    }

    return <div className={styles.container}>
        <div className={styles.categoryButtons}>
            <button 
                className={`${styles.categoryButton} ${selectedCategory === "ALL" ? styles.active : ""}`}
                onClick={() => handleCategoryChange("ALL")}
            >
                전체
            </button>
            <button 
                className={`${styles.categoryButton} ${selectedCategory === "NOTICE" ? styles.active : ""}`}
                onClick={() => handleCategoryChange("NOTICE")}
            >
                공지
            </button>
            <button 
                className={`${styles.categoryButton} ${selectedCategory === "FOOD" ? styles.active : ""}`}
                onClick={() => handleCategoryChange("FOOD")}
            >
                먹거리
            </button>
            <button 
                className={`${styles.categoryButton} ${selectedCategory === "GOODS" ? styles.active : ""}`}
                onClick={() => handleCategoryChange("GOODS")}
            >
                굿즈
            </button>
        </div>

        <div>

            {articleList.result.map((article: any) => 
                <div key={article.idx} className={styles.articleListBox}>
                    
                    <div className={styles.userBox}>
                        <span>
                            <img src={imageUrlFormat(article.profileImgUrl)}/>
                        </span>
                        <span>{article.nickname}</span>
                        <span>{elapsedTime(article.createdAt)}</span>
                    </div>
                    <div className={styles.articleInfoBox}>
                        <div className={styles.category}>
                            <span>{article.category}</span>
                        </div>
                        <div className={styles.title}>
                            <Link href={"/community/" + article.idx}><p>{article.title} </p></Link>
                        </div>
                        <div className={styles.articleCount}>
                            <span>👀 {article.viewCount}</span>
                            <span>💬 {article.commentCount}</span>
                        </div>
                    </div>
                </div>)}
        </div>
        <div className={styles.articleButton}>
            <Link href="/community/post">글쓰기</Link>
        </div>
    </div>
    ;
}