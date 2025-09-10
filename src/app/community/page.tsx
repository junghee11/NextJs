import Link from "next/link";
import styles from "../../styles/article/article.module.css"
import { getArticleList } from "../../service/community/apis";
import { elapsedTime } from "../../utils/stringFormat/date";
import { profileImageUrlFormat } from "../../utils/stringFormat/image";
import CategoryButtons from "../../components/article/CategoryButtons";
import Pagination from "../../components/article/Pagination";

interface PageProps {
  searchParams: { category?: string; page?: string }
}

export default async function ArticleList({ searchParams }: PageProps) {
    const category = searchParams.category || 'ALL';
    const page = parseInt(searchParams.page || '1');

    let articleList;
    try {
        articleList = await getArticleList(category, page);
    } catch (error) {
        console.error('게시글 목록 로딩 실패:', error);
        return <div className={styles.container}><div style={{textAlign: "center"}}>데이터를 불러올 수 없습니다</div></div>;
    }

    return <div className={styles.container}>
        <CategoryButtons currentCategory={category} />

        <div>
            {articleList.result.map((article: any) => 
                <div key={article.idx} className={styles.articleListBox}>
                    <div className={styles.userBox}>
                        <span>
                            <img src={profileImageUrlFormat(article.profileImgUrl)}/>
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
        
        <Pagination 
            currentPage={page} 
            totalPages={articleList.pageCount}
            category={category}
        />
        
        <div className={styles.articleButton}>
            <Link href="/community/post">글쓰기</Link>
        </div>
    </div>;
}