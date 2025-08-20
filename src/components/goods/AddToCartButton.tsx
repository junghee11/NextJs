"use client";
import { useState } from "react";
import { addCart } from "../../service/goods/apis";
import { checkUser } from "../../service/user/apis";
import CartConfirmModal from "./CartConfirmModal";
import styles from "../../styles/goods/goods-info.module.css"

interface AddToCartButtonProps {
    goodsCode: string;
    count : number;
    goodsName: string;
}

export default function AddToCartButton({ goodsCode, count, goodsName }: AddToCartButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCartClick = async () => {
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
            await addCart(goodsCode, count);
            alert('장바구니에 추가되었습니다!');
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
            <button className={styles.popupButton} onClick={handleCartClick}>장바구니</button>
            <CartConfirmModal 
                isOpen={isModalOpen}
                goodsName={goodsName}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}