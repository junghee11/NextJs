import styles from "../../styles//goods/BaseModal.module.css";

interface WishConfirmModalProps {
    isOpen: boolean;
    goodsName: string;
    isWished: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function WishConfirmModal({ isOpen, goodsName, isWished, onConfirm, onCancel }: WishConfirmModalProps) {
    if (!isOpen) return null;

    const actionText = isWished ? "찜 목록에서 제거" : "찜 목록에 추가";
    const confirmText = isWished ? "제거하기" : "추가하기";

    return (
        <div className={styles.overlay} onClick={onCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.title}>{actionText}</h3>
                <p className={styles.message}>
                    <strong>{goodsName}</strong>을(를) 찜 목록{isWished ? "에서 제거" : "에 추가"}하시겠습니까?
                </p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={`${styles.confirmBtn} ${styles.wish}`}>
                        {confirmText}
                    </button>
                    <button onClick={onCancel} className={styles.cancelBtn}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}