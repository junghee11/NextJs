import styles from "../../styles//goods/BaseModal.module.css";

interface CartConfirmModalProps {
    isOpen: boolean;
    goodsName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function CartConfirmModal({ isOpen, goodsName, onConfirm, onCancel }: CartConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>장바구니 추가</h3>
                <p className={styles.message}>
                    <strong>{goodsName}</strong>을(를) 장바구니에 담으시겠습니까?
                </p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={`${styles.confirmBtn} ${styles.cart}`}>
                        확인
                    </button>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}