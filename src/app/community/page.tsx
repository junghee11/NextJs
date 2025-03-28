import Link from "next/link";
import styles from "../../styles/baseball/article.module.css"
import { getArticleList } from "../../service/community/apis";

export default async function ArticleList() {
    const articleList = await getArticleList("FOOD", "SAMSUNG", 1);

    return <table className={styles.container}>
        <thead>
            <tr>
                <th>카테고리</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>작성일</th>
            </tr>
        </thead>
        <tbody>
            {articleList.result.map(article => 
            <tr key={article.idx}>
                <td>{article.category}</td>
                <td><Link href={"/community/" + article.idx}>{article.title} </Link></td>
                <td>{article.userId}</td>
                <td>{article.viewCount}</td>
                <td>{article.commentCount}</td>
                <td>{article.createdAt}</td>                        
            </tr>)}
        </tbody>
    </table>;
}