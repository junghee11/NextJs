import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyArticleListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyArticleList() {
    const articleList = await getMyArticleListServer();

    if (articleList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>작성한 게시글이 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <table>
                <thead>
                    <tr>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {articleList.result.map((article: any) => <tr key={article.idx}>
                        <td>{article.category}</td>
                        <td><Link href={"/community/" + article.idx}>{article.title} </Link></td>
                        <td>{article.createdAt}</td>                        
                    </tr>)}
                </tbody>
            </table>           
        </div>
    </div>;
}