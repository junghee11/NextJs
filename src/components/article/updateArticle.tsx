"use client"

import styles from "../../styles/baseball/article.module.css"
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
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    async function clickUpdateButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (title == null || title == "") {
            alert("제목을 입력해주세요")
            return;
        } else if (content == null || content == "" || content.length <= 10) {
            alert("글 내용을 입력해주세요. 글 내용은 최소 10자 이상이여야합니다")
            return;
        }

        try { 
            const response = await updateArticle(articleId, title, content);
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

    return <div className={styles.container}>
        <form name="updateArticle">
            <div>
                <label htmlFor="title">제목 : </label>
                <input type="text" 
                    id="title"
                    defaultValue={articleTitle}
                    onChange={(e) => setTitle(e.target.value)}
                    required />
            </div>
            <div>
                <textarea id="content"
                    defaultValue={articleContent}
                    onChange={(e) => setContent(e.target.value)}
                    required>
                </textarea>
            </div>
            <button type="submit" onClick={clickUpdateButton}>등록</button>
        </form>
    </div>;
}