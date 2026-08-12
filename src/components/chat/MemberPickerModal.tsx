'use client';

import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '../../styles/chat/Chat.module.css';
import { User } from '../../types/user/user';

interface Props {
    title: string;
    confirmLabel: string;
    candidates: User[];
    description?: string;
    onConfirm: (selected: User[]) => void;
    onClose: () => void;
}

export default function MemberPickerModal({ title, confirmLabel, candidates, description, onConfirm, onClose }: Props) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggle = (userId: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        onConfirm(candidates.filter(user => selectedIds.has(user.userId)));
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.memberPickerModal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseButton} onClick={onClose} aria-label="닫기">
                    <FaTimes size={16} />
                </button>
                <h3 className={styles.memberPickerTitle}>{title}</h3>
                {description && <p className={styles.memberPickerDescription}>{description}</p>}
                <ul className={styles.memberPickerList}>
                    {candidates.length === 0 && (
                        <li className={styles.memberPickerEmpty}>초대할 수 있는 회원이 없습니다.</li>
                    )}
                    {candidates.map(user => (
                        <li key={user.userId}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(user.userId)}
                                    onChange={() => toggle(user.userId)}
                                />
                                <span>{user.nickname}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                <button
                    className={styles.memberPickerConfirm}
                    onClick={handleConfirm}
                    disabled={selectedIds.size === 0}
                >
                    {confirmLabel} {selectedIds.size > 0 && `(${selectedIds.size}명)`}
                </button>
            </div>
        </div>
    );
}
