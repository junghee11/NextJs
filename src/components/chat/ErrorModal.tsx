'use client';

import { FaExclamationCircle } from 'react-icons/fa';
import styles from '../../styles/chat/Chat.module.css';

interface Props {
    message: string;
    onClose: () => void;
}

export default function ErrorModal({ message, onClose }: Props) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.errorModal} onClick={e => e.stopPropagation()}>
                <FaExclamationCircle className={styles.errorIcon} size={32} />
                <p className={styles.errorMessage}>{message}</p>
                <button className={styles.errorCloseButton} onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}
