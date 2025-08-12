"use client"

import styles from "../../styles/article/article.module.css"
import { updateArticle } from "../../service/community/apis";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface UpdateArticleProps {
    articleId: number;
    articleTitle : string;
    articleContent : string;
}

export default function UpdateArticle({ articleId, articleTitle, articleContent }: UpdateArticleProps) {
    const router = useRouter();
    const [title, setTitle] = useState(articleTitle);
    const [content, setContent] = useState(articleContent);

    async function clickUpdateButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const finalTitle = title || articleTitle;
        const finalContent = content || articleContent;
        
        if (finalTitle == null || finalTitle == "") {
            alert("제목을 입력해주세요")
            return;
        } else if (finalContent == null || finalContent == "" || finalContent.length <= 10) {
            alert("글 내용을 입력해주세요. 글 내용은 최소 10자 이상이여야합니다")
            return;
        }

        try { 
            const response = await updateArticle(articleId, finalTitle, finalContent);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            } 
            
            router.push("/community");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('게시글 등록에 실패했습니다.');
        }
    }

    return <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>글 수정하기</h1>
        <form name="updateArticle">
            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>
                    제목 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input 
                    type="text" 
                    id="title"
                    className={styles.formInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    required 
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.formLabel}>
                    내용 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea 
                    id="content"
                    className={styles.formTextarea}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="게시글 내용을 입력하세요 (최소 10자 이상)"
                    required
                />
                <div className={`${styles.characterCount} ${
                    content.length < 10 ? styles.error : 
                    content.length < 20 ? styles.warning : ''
                }`}>
                    {content.length}/10 (최소 글자수)
                </div>
            </div>
            <div className={styles.buttonGroup}>
                <a href="/community" className={styles.cancelButton}>
                    취소
                </a>
                <button 
                    type="submit" 
                    className={styles.submitButton} 
                    onClick={clickUpdateButton}
                >
                    수정 완료
                </button>
            </div>
        </form>
    </div>;
}