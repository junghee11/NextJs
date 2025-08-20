"use client";
import { useState } from "react";
import { toggleWish } from "../../service/goods/apis";
import { checkUser } from "../../service/user/apis";
import WishConfirmModal from "./WishConfirmModal";
import styles from "../../styles/goods/goods-info.module.css"

interface WishButtonProps {
    goodsCode: string;
    goodsName: string;
}

export default function WishButton({ goodsCode, goodsName }: WishButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWished, setIsWished] = useState(false);

    const handleWishClick = async () => {
        try {
            await checkUser()

            setIsModalOpen(true);
        } catch (error) {
            if (error.status == 400) {
                alert("로그인 후 이용해주세요");
            } else if (error.message) {
                alert(error.message);
            }
        }
    };

    const handleConfirm = async () => {
        try {
            await toggleWish(goodsCode.toString());
            setIsWished(!isWished);

            const message = isWished ? '찜 목록에서 제거되었습니다!' : '찜 목록에 추가되었습니다!';
            alert(message);

            setIsModalOpen(false);
        } catch (error) {
            if (error.status == 400) {
                alert("로그인 후 이용해주세요")
            } else if (error.message) {
                alert(error.message)
            } else {
                alert('장바구니 추가에 실패했습니다.');
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button className={styles.popupButton} onClick={handleWishClick}>
                찜 <span>{isWished ? '❤' : '♡'}</span>
            </button>
            <WishConfirmModal 
                isOpen={isModalOpen}
                goodsName={goodsName}
                isWished={isWished}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}