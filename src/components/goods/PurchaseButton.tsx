"use client";
import { useState } from "react";
import { purchaseGoods } from "../../service/goods/apis";
import PurchaseConfirmModal from "./PurchaseConfirmModal";
import styles from "../../styles/goods/goods-info.module.css"
import Link from "next/link";

interface PurchaseButtonProps {
    goodsCode: string;
    goodsName: string;
    price: number;
    count: number;
}

export default function PurchaseButton({ goodsCode, goodsName, price, count }: PurchaseButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePurchaseClick = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = async (payType: string) => {
        try {
            const payInfo = await purchaseGoods(goodsCode, count, payType);
            console.log(payInfo);

            window.open(payInfo.result.next_redirect_pc_url, "_blank");

            setIsModalOpen(false);
        } catch (error) {
            if (error.message) {
                alert(error.message);
            } else if (error.status == 400) {
                alert("로그인 후 이용해주세요.");
            } else {
                alert('구매에 실패했습니다.');
                console.error(error);
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <button className={styles.purchaseButton} onClick={handlePurchaseClick}>바로구입</button>
            <PurchaseConfirmModal 
                isOpen={isModalOpen}
                goodsName={goodsName}
                price={price*count}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
}