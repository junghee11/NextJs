"use client"

import { deleteArticle } from "../../service/community/apis";
import { useRouter } from "next/navigation";

interface DeleteArticleButtonProps {
    articleId: number;
}

export default function DeleteArticleButton({ articleId }: DeleteArticleButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            try {
                const response = await deleteArticle(articleId);
                if (typeof response === 'object' && response !== null && 'result' in response) {
                    alert((response as any).result);
                } 
                
                router.push("/community");
                router.refresh();
            } catch (error) {
                console.error('게시글 삭제 실패:', error);
                alert('게시글 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <button onClick={handleDelete}>삭제</button>
    );
} 