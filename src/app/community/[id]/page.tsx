import { getArticle, getCommentList } from "../../../service/community/apis";
import styles from "../../../styles/baseball/article.module.css"
import { elapsedTime } from "../../../utils/function/date";

interface IParams {
    params : {id:number}
}

export default async function Article({params : {id}} : IParams) {
    const article = await getArticle(id);
    const comments = await getCommentList(id);

    return <div className={styles.container}>
        <div className={styles.articleBox}>
            <div className={styles.articleTitle}>
                <div>
                    <strong>커뮤니티 {"> "} {article.result.category}</strong> 
                </div>
                <p>
                    <strong><img src={article.result.imgCard} alt="profile" /></strong> {article.result.nickname}
                    <strong> • </strong>{" "}
                    {elapsedTime(article.result.createdAt)}
                    <strong> 👀 </strong>{" "}
                    {article.result.viewCount}
                    <strong> 💬 </strong>{" "}
                    {article.result.commentCount}
                </p>
                <h1>{article.result.title}</h1>
            </div>
            <div className={styles.articleText}>
                <p>{article.result.content}</p>
            </div>
        </div>
        <hr />
        <div>
            
        {comments.result.map(comment => 
            <div key={comment.idx}>
                <div>
                    <span><img src={comment.profile == null ? "/images/tmp/profile/img_profile.png" : comment.profile} alt="" /></span>
                    <span>{comment.nickname}</span>
                    <span>{elapsedTime(comment.createdAt)}</span>
                </div>
                <div>{comment.content}</div>
                <div>
                    <span>댓글쓰기</span>
                    <span>댓글 {comment.commentCount}</span>
                    <span>추천 {comment.up}</span>
                    <span>비추천 {comment.down}</span>
                </div>
            </div>)}
        </div>
    </div>;
}