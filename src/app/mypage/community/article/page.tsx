import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyArticleListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyArticleList() {
    const articleList = await getMyArticleListServer();

    if (articleList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>📝</div>
                    <h3>작성한 게시글이 없습니다</h3>
                    <p>첫 번째 게시글을 작성해보세요!</p>
                    <a href="/community/post" className={styles.actionButton}>
                        게시글 작성하기
                    </a>
                </div>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <h2>내가 작성한 게시글</h2>
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {articleList.result.map((article: any) => <tr key={article.idx}>
                        <td>
                            <span style={{
                                background: '#dbeafe',
                                color: '#1d4ed8',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}>
                                {article.category}
                            </span>
                        </td>
                        <td><Link href={"/community/" + article.idx}>{article.title}</Link></td>
                        <td>{new Date(article.createdAt).toLocaleDateString()}</td>                        
                    </tr>)}
                </tbody>
            </table>           
        </div>
    </div>;
}