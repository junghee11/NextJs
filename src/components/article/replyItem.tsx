import LoginRequiredButton from '../common/LoginRequiredButton';
import DeleteCommentButton from './deleteCommentButton';
import { elapsedTime } from '../../utils/stringFormat/date';
import { profileImageUrlFormat } from '../../utils/stringFormat/image';

interface ReplyItemProps {
    comment: any;
    userInfo: any;
    styles: any;
    isReply?: boolean;
    onToggle: (commentId: number, type: 'UP' | 'DOWN', parentId?: number | null) => void;
    onDeleted: () => void;
    parentCommentId?: number;
}

export default function ReplyItem({ 
    comment, 
    userInfo, 
    styles, 
    onToggle, 
    onDeleted,
    parentCommentId
}: ReplyItemProps) {
    if (comment.state === 0) {
        return (
            <div key={comment.idx} className={styles.replyItem}>
                <div className={styles.commentTitle}>
                    <div className={styles.userBox}>
                        <span><img src={profileImageUrlFormat(comment.profileImgUrl)} alt="" /></span>
                        <span>{comment.nickname}</span>
                        <span>{elapsedTime(comment.createdAt)}</span>
                    </div>
                    <div className={styles.buttonBox}>
                        <LoginRequiredButton 
                            onClick={() => onToggle(comment.idx, 'UP', parentCommentId || null)}
                        >
                            👍 추천 {comment.up}
                        </LoginRequiredButton>
                        <LoginRequiredButton 
                            onClick={() => onToggle(comment.idx, 'DOWN', parentCommentId || null)}
                        >
                            👎 비추천 {comment.down}
                        </LoginRequiredButton>
                        
                        {userInfo && comment.userId == userInfo.result.userId &&
                        <DeleteCommentButton 
                            commentId={comment.idx} 
                            onCommentDeleted={onDeleted}
                        />}
                    </div>
                </div>
                <div className={styles.commentContent}>{comment.content}</div>
            </div>
        );
    } else {
        return (
            <div key={comment.idx} className={styles.replyItem}>
                <div className={styles.commentTitle}>
                    <div className={styles.userBox}>
                        <span>-</span>
                        <span>{elapsedTime(comment.createdAt)}</span>
                    </div>
                </div>
                <div className={styles.commentContent} style={{color: '#999', fontStyle: 'italic'}}>
                    삭제처리된 댓글입니다
                </div>
            </div>
        );
    }
}