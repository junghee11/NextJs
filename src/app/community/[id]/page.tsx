"use client"

import { getUserInfo } from "../../../service/user/apis";
import { getArticle, getCommentList, addComment, toggleComment } from "../../../service/community/apis";
import styles from "../../../styles/article/article.module.css"
import { elapsedTime } from "../../../utils/function/date";
import DeleteArticleButton from "../../../components/article/deleteArticleButton";
import DeleteCommentButton from "../../../components/article/deleteCommentButton";
import LoginRequiredButton from "../../../components/common/LoginRequiredButton";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface IParams {
    params: { id: number }
}

export default function Article({ params: { id } }: IParams) {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [article, setArticle] = useState<any>(null);
    const [comments, setComments] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [commentInput, setCommentInput] = useState("");

    const refreshComments = async () => {
        try {
            const commentsData = await getCommentList(id);
            setComments(commentsData);
        } catch (error) {
            console.error('댓글 목록 새로고침 실패:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim() || commentInput.length < 10) {
            alert("댓글을 입력해주세요. 댓글은 10자 이상이여야 합니다");
            return;
        }

        try { 
            const response = await addComment(id, commentInput);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            }
            
            await refreshComments();
        } catch (error) {
            console.error(error);
            alert('댓글 등록에 실패했습니다.');
        }
        
        setCommentInput("");
    };

    const handleCommentToggle = async (commentId: number, recommend: string) => {
        try {
            const response = await toggleComment(commentId, recommend);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            }

            await refreshComments();
        } catch (error) {
            console.error('댓글 추천/비추천 실패:', error);
            alert(`댓글 추천/비추천 실패`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const access_token = Cookies.get("access_token");
                
                // 병렬로 데이터 로딩
                const [userData, articleData, commentsData] = await Promise.all([
                    getUserInfo(access_token),
                    getArticle(id),
                    getCommentList(id)
                ]);

                setUserInfo(userData);
                setArticle(articleData);
                setComments(commentsData);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className={styles.container}><div className={styles.loading}>로딩 중...</div></div>;
    }

    if (!article) {
        return <div className={styles.container}><div className={styles.error}>게시글을 찾을 수 없습니다.</div></div>;
    }

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
        {userInfo && userInfo.result.userId == article.result.userId &&
            <div className={styles.actionButtons}>
                <a href={"update/" + article.result.idx}>수정</a>
                <DeleteArticleButton articleId={article.result.idx} />
            </div>
        }
        <div className={styles.commentSection}>
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <textarea
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder={!userInfo ? "로그인 후 이용 가능합니다" : "댓글을 입력하세요"}
                    rows={3}
                    disabled={!userInfo}
                />
                <button type="submit" disabled={!userInfo}>
                    등록
                </button>
            </form>
        </div>
        <div>
            {comments && comments.result.map((comment: any) => 
                <div key={comment.idx} className={styles.commentItem}>
                    <div className={styles.commentTitle}>
                        <div className={styles.userBox}>
                            <span><img src={comment.profile == null ? "/images/tmp/profile/img_profile.png" : comment.profile} alt="" /></span>
                            <span>{comment.nickname}</span>
                            <span>{elapsedTime(comment.createdAt)}</span>
                        </div>
                        <div className={styles.buttonBox}>
                            <LoginRequiredButton 
                                onClick={() => handleCommentToggle(comment.idx, 'UP')}
                            >
                                👍 추천 {comment.up}
                            </LoginRequiredButton>
                            <LoginRequiredButton 
                                onClick={() => handleCommentToggle(comment.idx, 'DOWN')}
                            >
                                👎 비추천 {comment.down}
                            </LoginRequiredButton>
                            
                            {userInfo && comment.userId == userInfo.result.userId &&
                            <DeleteCommentButton 
                                commentId={comment.idx} 
                                onCommentDeleted={refreshComments}
                            />
                            }
                        </div>
                    </div>
                    <div className={styles.commentContent}>{comment.content}</div>
                </div>)}
        </div>
    </div>;
}