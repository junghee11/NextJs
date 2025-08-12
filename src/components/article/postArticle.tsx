"use client"

import styles from "../../styles/article/article.module.css"
import { postArticle } from "../../service/community/apis";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostArticle() {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    async function clickPostButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (category == null || category == "") {
            alert("카테고리를 선택해주세요")
            return;
        } else if (title == null || title == "") {
            alert("제목을 입력해주세요")
            return;
        } else if (content == null || content == "" || content.length <= 10) {
            alert("글 내용을 입력해주세요. 글 내용은 최소 10자 이상이여야합니다")
            return;
        }

        try { 
            const response = await postArticle(category, title, content);
            if (typeof response === 'object' && response !== null && 'message' in response) {
                alert((response as any).message);
            } else {
                alert('게시글이 성공적으로 등록되었습니다.');
            }
            
            router.push("/community");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('게시글 등록에 실패했습니다.');
        }
    }

    return <div className={styles.formContainer}>
        <h1 className={styles.formTitle}>글 작성하기</h1>
        <form name="postArticle">
            <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.formLabel}>
                    카테고리 <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                    id="category" 
                    name="category"
                    className={styles.formSelect}
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="NOTICE">공지</option>
                    <option value="FOOD">먹거리</option>
                    <option value="GOODS">굿즈</option>
                </select>
            </div>
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
                    onClick={clickPostButton}
                >
                    등록
                </button>
            </div>
        </form>
    </div>;
}