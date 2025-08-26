"use client"

import { getUserInfo } from "../../../service/user/apis";
import { getArticle, getCommentList, addComment, toggleComment } from "../../../service/community/apis";
import styles from "../../../styles/article/article.module.css"
import { elapsedTime } from "../../../utils/stringFormat/date";
import { profileImageUrlFormat } from "../../../utils/stringFormat/image";
import DeleteArticleButton from "../../../components/article/deleteArticleButton";
import DeleteCommentButton from "../../../components/article/deleteCommentButton";
import LoginRequiredButton from "../../../components/common/LoginRequiredButton";
import { useState, useEffect } from "react";
import dompurify from "dompurify";

interface IParams {
    params: { id: number }
}

export default function Article({ params: { id } }: IParams) {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [article, setArticle] = useState<any>(null);
    const [comments, setComments] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [commentInput, setCommentInput] = useState("");
    const [replyStates, setReplyStates] = useState<{[key: number]: boolean}>({});
    const [replyInputs, setReplyInputs] = useState<{[key: number]: string}>({});
    const [replys, setReplys] = useState<{[key: number]: any}>({});

    const refreshComments = async () => {
        try {
            const commentsData = await getCommentList(id, null);
            setComments(commentsData);
        } catch (error) {
            console.error('댓글 목록 새로고침 실패:', error);
        }
    };

    const refreshReplys = async (commentId : number) => {
        try {
            const replyData = await getCommentList(id, commentId);
            setReplys(prev => ({
                ...prev,
                [commentId]: replyData
            }));
        } catch (error) {
            console.error('대댓글 목록 새로고침 실패:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentInput.trim() || commentInput.length < 10) {
            alert("댓글을 입력해주세요. 댓글은 10자 이상이여야 합니다");
            return;
        }

        try { 
            const response = await addComment(id, null, commentInput);
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

    const handleCommentToggle = async (commentId: number, recommend: string, commentGroup : number) => {
        try {
            const response = await toggleComment(commentId, recommend);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            }

            if (commentGroup) {
                await refreshReplys(commentGroup);
            } else {
                await refreshComments();
            }
        } catch (error) {
            console.error('댓글 추천/비추천 실패:', error);
            alert(`댓글 추천/비추천 실패`);
        }
    };

    const handleGetReplyButton = async (articleId: number, commentId: number) => {
        setReplyStates(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));

        if (!replyStates[commentId]) {
            try {
                const replyData = await getCommentList(articleId, commentId);
                setReplys(prev => ({
                    ...prev,
                    [commentId]: replyData
                }));
            } catch (error) {
                console.error('대댓글 목록 가져오기 실패:', error);
            }
        }
    };

    const handleReplySubmit = async (commentId: number, replyContent: string) => {
        if (!replyContent.trim() || replyContent.length < 10) {
            alert("대댓글을 입력해주세요. 댓글은 10자 이상이어야 합니다");
            return;
        }

        try {
            const response = await addComment(id, commentId, replyContent);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            }

            setReplyInputs(prev => ({
                ...prev,
                [commentId]: ""
            }));

            const replyData = await getCommentList(id, commentId);
            setReplys(prev => ({
                ...prev,
                [commentId]: replyData
            }));
        } catch (error) {
            console.error('대댓글 등록 실패:', error);
            alert('대댓글 등록에 실패했습니다.');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [userData, articleData, commentsData] = await Promise.all([
                    getUserInfo(),
                    getArticle(id),
                    getCommentList(id, null)
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

    const sanitizer = dompurify.sanitize;

    return <div className={styles.container}>
        <div className={styles.articleBox}>
            <div className={styles.articleTitle}>
                <div>
                    <strong>커뮤니티 {"> "} {article.result.category}</strong> 
                </div>
                <p>
                    <strong>
                        <img src={profileImageUrlFormat(article.profileImgUrl)} alt="profile" />
                    </strong> {article.result.nickname}
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
                <div dangerouslySetInnerHTML={{ __html: sanitizer(article.result.content) }} />
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
                            <span><img src={profileImageUrlFormat(comment.profileImgUrl)} alt="" /></span>
                            <span>{comment.nickname}</span>
                            <span>{elapsedTime(comment.createdAt)}</span>
                        </div>
                        <div className={styles.buttonBox}>
                            <LoginRequiredButton 
                                onClick={() => handleCommentToggle(comment.idx, 'UP', null)}
                            >
                                👍 추천 {comment.up}
                            </LoginRequiredButton>
                            <LoginRequiredButton 
                                onClick={() => handleCommentToggle(comment.idx, 'DOWN', null)}
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
                    <div className={styles.replyButtonBox}>
                        <button 
                            onClick={() => handleGetReplyButton(article.result.idx, comment.idx)}
                        >
                            💬 댓글
                        </button>
                    </div>

                    {replyStates[comment.idx] && (
                        <div className={styles.replySection}>
                            {replys[comment.idx] && replys[comment.idx].result.map((reply: any) => (
                                <div key={reply.idx} className={styles.replyItem}>
                                    <div className={styles.commentTitle}>
                                        <div className={styles.userBox}>
                                            <span><img src={profileImageUrlFormat(reply.profileImgUrl)} alt="" /></span>
                                            <span>{reply.nickname}</span>
                                            <span>{elapsedTime(reply.createdAt)}</span>
                                        </div>
                                        <div className={styles.buttonBox}>
                                            <LoginRequiredButton 
                                                onClick={() => handleCommentToggle(reply.idx, 'UP', comment.idx)}
                                            >
                                                👍 추천 {reply.up}
                                            </LoginRequiredButton>
                                            <LoginRequiredButton 
                                                onClick={() => handleCommentToggle(reply.idx, 'DOWN', comment.idx)}
                                            >
                                                👎 비추천 {reply.down}
                                            </LoginRequiredButton>
                                            
                                            {userInfo && reply.userId == userInfo.result.userId &&
                                            <DeleteCommentButton 
                                                commentId={reply.idx} 
                                                onCommentDeleted={() => refreshReplys(comment.idx)}
                                            />
                                            }
                                        </div>
                                    </div>
                                    <div className={styles.commentContent}>{reply.content}</div>
                                </div>
                            ))}

                            <div className={styles.replyForm}>
                                <textarea
                                    value={replyInputs[comment.idx] || ""}
                                    onChange={e => setReplyInputs(prev => ({
                                        ...prev,
                                        [comment.idx]: e.target.value
                                    }))}
                                    placeholder={!userInfo ? "로그인 후 이용 가능합니다" : "대댓글을 입력하세요"}
                                    rows={3}
                                    disabled={!userInfo}
                                />
                                <button 
                                    type="button" 
                                    disabled={!userInfo}
                                    onClick={() => handleReplySubmit(comment.idx, replyInputs[comment.idx] || "")}
                                >
                                    댓글 등록
                                </button>
                            </div>
                        </div>
                    )}
                </div>)}
        </div>
    </div>;
}