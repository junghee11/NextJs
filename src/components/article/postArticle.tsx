"use client"

import styles from "../../styles/article/article.module.css"
import { postArticle, uploadArticleImage } from "../../service/community/apis";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function PostArticle() {
    const router = useRouter();
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const imageHandler = () => {
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
                        
                        const size = prompt('이미지 크기를 선택하세요:\n1. 작게 (200px)\n2. 보통 (400px)\n3. 크게 (원본 크기)', '2');
                        
                        let width = '400px';
                        switch(size) {
                            case '1':
                                width = '200px';
                                break;
                            case '2':
                                width = '400px';
                                break;
                            case '3':
                                width = '100%';
                                break;
                            default:
                                width = '400px';
                        }
                        
                        // HTML img 태그를 직접 content에 삽입
                        const imgTag = `<img src="${imageUrl}" alt="uploaded image" style="width: ${width}; height: auto; max-width: 100%; border-radius: 8px; margin: 16px 0; display: block;" />`;
                        setContent(prev => prev + imgTag);
                        
                        console.log('이미지가 에디터에 삽입되었습니다.');
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
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'blockquote', 'code-block',
        'link', 'image'
    ];

    async function clickPostButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (category == null || category == "") {
            alert("카테고리를 선택해주세요")
            return;
        } else if (title == null || title == "") {
            alert("제목을 입력해주세요")
            return;
        } else if (content == null || content == "" || content.replace(/<[^>]*>/g, '').length <= 10) {
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
                    onClick={clickPostButton}
                >
                    등록
                </button>
            </div>
        </form>
    </div>;
}