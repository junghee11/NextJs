"use client"

import { deleteComment } from "../../service/community/apis";
import { useRouter } from "next/navigation";

interface DeleteCommentButtonProps {
    commentId: number;
    onCommentDeleted?: () => void; 
}

export default function DeleteCommentButton({ commentId, onCommentDeleted }: DeleteCommentButtonProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                const response = await deleteComment(commentId);
                console.log(response);
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    alert((response as any).message);
                } 
                
                if (onCommentDeleted) {
                    onCommentDeleted();
                } 
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <button onClick={handleDelete}>삭제</button>
    );
} 