'use client';

import { FaUserCircle, FaTimes } from 'react-icons/fa';
import styles from '../../styles/chat/Chat.module.css';
import { User } from '../../types/user/user';
import { teamNameByCode, TeamCode } from '../../types/baseball/team';

interface Props {
    user: User;
    onClose: () => void;
}

export default function ProfileModal({ user, onClose }: Props) {
    const teamName = user.team ? teamNameByCode.get(user.team as TeamCode) ?? user.team : '없음';

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.profileModal} onClick={e => e.stopPropagation()}>
                <button className={styles.modalCloseButton} onClick={onClose} aria-label="닫기">
                    <FaTimes size={16} />
                </button>
                <div className={styles.profileImageWrap}>
                    {user.profileImgUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.profileImgUrl} alt={`${user.nickname} 프로필`} />
                    ) : (
                        <FaUserCircle className={styles.profileImagePlaceholder} />
                    )}
                </div>
                <h3 className={styles.profileNickname}>{user.nickname}</h3>
                <dl className={styles.profileInfoList}>
                    <div>
                        <dt>응원하는 팀</dt>
                        <dd>{teamName}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
