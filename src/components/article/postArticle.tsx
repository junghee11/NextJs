"use client"

import styles from "../../styles/baseball/article.module.css"
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

    return <div className={styles.container}>
        <form name="postArticle">
            <div>
                <label htmlFor="category">
                    카테고리
                </label>
                <select 
                    id="category" 
                    name="category"
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="NOTICE">공지</option>
                    <option value="FOOD">먹거리</option>
                    <option value="GOODS">굿즈</option>
                </select>
            </div>
            <div>
                <label htmlFor="title">제목 : </label>
                <input type="text" 
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required />
            </div>
            <div>
                <textarea id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required>
                </textarea>
            </div>
            <button type="submit" onClick={clickPostButton}>등록</button>
        </form>
    </div>;
}