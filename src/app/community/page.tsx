"use client"

import Link from "next/link";
import styles from "../../styles/baseball/article.module.css"
import { getArticleList } from "../../service/community/apis";
import { useState, useEffect } from "react";

export default function ArticleList() {
    const [articleList, setArticleList] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                const data = await getArticleList("FOOD", "SAMSUNG", 1);
                setArticleList(data);
            } catch (error) {
                console.error('게시글 목록 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className={styles.container}><div style={{textAlign: "center"}}>로딩 중...</div></div>;
    }

    if (!articleList) {
        return <div className={styles.container}><div style={{textAlign: "center"}}>데이터를 불러올 수 없습니다</div></div>;
    }

    return <div className={styles.container}>
        <table>
            <thead>
                <tr>
                    <th>카테고리</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회</th>
                    <th>댓글</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                {articleList.result.map((article: any) => 
                <tr key={article.idx}>
                    <td>{article.category}</td>
                    <td><Link href={"/community/" + article.idx}>{article.title} </Link></td>
                    <td>{article.userId}</td>
                    <td>{article.viewCount}</td>
                    <td>{article.commentCount}</td>
                    <td>{article.createdAt}</td>                        
                </tr>)}
            </tbody>
        </table>
        <Link href="/community/post">글쓰기</Link>
    </div>
    ;
}