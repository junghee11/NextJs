import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyCommentListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import { elapsedTime } from "../../../../utils/function/date";

export default async function MyCommentList() {
    const commentList = await getMyCommentListServer();

    if (commentList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>작성한 댓글이 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div>
            {commentList.result.map((comment: any) => 
                <div key={comment.idx}>
                    <span>{comment.content}</span>
                    <span>{elapsedTime(comment.createdAt)}</span>
                </div>)}
        </div>
    </div>;
}