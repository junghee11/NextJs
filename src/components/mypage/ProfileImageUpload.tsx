'use client';

import { useState, useRef } from 'react';
import { changeProfileImage } from '../../service/mypage/apis';

interface ProfileImageUploadProps {
    currentImageUrl: string;
    onImageChange?: (newImageUrl: string) => void;
}

export default function ProfileImageUpload({ 
    currentImageUrl, 
    onImageChange 
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(currentImageUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 크기 검증 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하로 업로드해주세요.');
            return;
        }

        // 파일 형식 검증
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await changeProfileImage(formData);
            
            if (response.message) {
                const newImageUrl = response.imageUrl;
                if (newImageUrl) {
                    const fullImageUrl = process.env.NEXT_PUBLIC_AWS_IMAGE_URL + newImageUrl;
                    setImageUrl(fullImageUrl);
                    onImageChange?.(fullImageUrl);
                    alert('프로필 이미지가 변경되었습니다.');
                }
            } else {
                alert('이미지 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('Profile image upload error:', error);
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
                src={imageUrl} 
                alt="profile"
                style={{ 
                    cursor: 'pointer',
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    border: '2px solid #ddd'
                }}
                onClick={handleImageClick}
            />
            
            {isUploading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px'
                }}>
                    업로드 중...
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            
            <div style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                backgroundColor: 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                fontSize: '12px'
            }} onClick={handleImageClick}>
                📷
            </div>
        </div>
    );
}