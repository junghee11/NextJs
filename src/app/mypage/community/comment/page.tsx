import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyCommentListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import { elapsedTime } from "../../../../utils/stringFormat/date";
import Link from "next/link";

export default async function MyCommentList() {
    const commentList = await getMyCommentListServer();

    if (commentList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>💬</div>
                    <h3>작성한 댓글이 없습니다</h3>
                    <p>게시글에 첫 번째 댓글을 달아보세요!</p>
                    <a href="/community" className={styles.actionButton}>
                        커뮤니티 둘러보기
                    </a>
                </div>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <h2>내가 작성한 댓글</h2>
            <div>
                {commentList.result.map((comment: any) => 
                    <Link key={comment.idx} href={"/community/" + comment.articleIdx} className={styles.commentCard}>
                        <div className={styles.commentContent}>
                            {comment.content}
                        </div>
                        <div className={styles.commentMeta}>
                            {elapsedTime(comment.createdAt)}
                        </div>
                    </Link>
                )}
            </div>
        </div>
    </div>;
}