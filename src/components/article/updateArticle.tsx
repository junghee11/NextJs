"use client"

import styles from "../../styles/article/article.module.css"
import { updateArticle, uploadArticleImage } from "../../service/community/apis";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import {ImageActions} from '@xeger/quill-image-actions'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const registerQuillModules = async () => {
    const { default: Quill } = await import('quill');
    Quill.register('modules/imageActions', ImageActions);
};

interface UpdateArticleProps {
    articleId: number;
    articleTitle : string;
    articleContent : string;
}

export default function UpdateArticle({ articleId, articleTitle, articleContent }: UpdateArticleProps) {
    const router = useRouter();
    const [title, setTitle] = useState(articleTitle);
    const [content, setContent] = useState(articleContent);

    useEffect(() => {
        registerQuillModules();
    }, []);

    const modules = useMemo(() => ({
        imageActions: {},
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'align': [] }],
                ['link', 'image']
            ],
            handlers: {
                image: function() {
                    const quill = this.quill;
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.click();

                    input.onchange = async () => {
                        const file = input.files?.[0];
                        if (file) {
                            if (file.size > 10 * 1024 * 1024) {
                                alert('파일 크기는 10MB 이하로 업로드해주세요.');
                                return;
                            }

                            const formData = new FormData();
                            formData.append('file', file);

                            try {
                                const response = await uploadArticleImage(formData);
                                
                                if (response && response.imageUrl) {
                                    const imageUrl = process.env.NEXT_PUBLIC_AWS_IMAGE_URL + response.imageUrl;
                                    
                                    const range = quill.getSelection();
                                    const index = range ? range.index : quill.getLength();
                                    
                                    quill.insertEmbed(index, 'image', imageUrl);
                                    quill.setSelection(index + 1);

                                } else {
                                    console.error('Invalid response or missing imageUrl:', response);
                                    alert('이미지 업로드 응답이 올바르지 않습니다.');
                                }
                            } catch (error) {
                                console.error('Image upload error:', error);
                                alert('이미지 업로드 중 오류가 발생했습니다.');
                            }
                        }
                    };
                }
            }
        }
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'blockquote', 'code-block',
        'link', 'image',
        'height', 'width', 'float', 'align'
    ];

    async function clickUpdateButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const finalTitle = title || articleTitle;
        const finalContent = content || articleContent;
        
        if (finalTitle == null || finalTitle == "") {
            alert("제목을 입력해주세요")
            return;
        } else if (finalContent == null || finalContent == "" || finalContent.replace(/<[^>]*>/g, '').length <= 10) {
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
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="게시글 내용을 입력하세요 (최소 10자 이상)"
                    style={{ height: '300px', marginBottom: '50px' }}
                />
                <div className={`${styles.characterCount} ${
                    content.replace(/<[^>]*>/g, '').length < 10 ? styles.error : 
                    content.replace(/<[^>]*>/g, '').length < 20 ? styles.warning : ''
                }`}>
                    {content.replace(/<[^>]*>/g, '').length}/10 (최소 글자수)
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