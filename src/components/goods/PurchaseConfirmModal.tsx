import { useState } from "react";
import styles from "../../styles//goods/BaseModal.module.css";

interface PurchaseConfirmModalProps {
    isOpen: boolean;
    goodsName: string;
    price: number;
    onConfirm: (payType: string) => void;
    onCancel: () => void;
}

export default function PurchaseConfirmModal({ isOpen, goodsName, price, onConfirm, onCancel }: PurchaseConfirmModalProps) {
    const [selectedPayType, setSelectedPayType] = useState("KAKAO_PAY");

    if (!isOpen) return null;

    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0, 
        }).format(number);
    };

    const handleConfirm = () => {
        onConfirm(selectedPayType);
    };

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>바로구입</h3>
                <div className={styles.goodsInfo}>
                    <p className={styles.goodsName}><strong>{goodsName}</strong></p>
                    <p className={styles.price}>가격: {formatNumber(price)}원</p>
                </div>
                
                <div className={styles.paymentSection}>
                    <h4>결제 방법 선택</h4>
                    <div className={styles.paymentOptions}>
                        <label className={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="KAKAO_PAY" 
                                checked={selectedPayType === "KAKAO_PAY"}
                                onChange={(e) => setSelectedPayType(e.target.value)}
                            />
                            카카오페이
                        </label>
                        {/* <label className={styles.radioLabel}>
                            <input 
                                type="radio" 
                                value="CREDIT_CART" 
                                checked={selectedPayType === "CREDIT_CART"}
                                onChange={(e) => setSelectedPayType(e.target.value)}
                            />
                            카드결제
                        </label> */}
                    </div>
                </div>
                
                <div className={styles.buttons}>
                    <button onClick={handleConfirm} className={`${styles.confirmBtn} ${styles.purchase}`}>
                        구매하기
                    </button>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}