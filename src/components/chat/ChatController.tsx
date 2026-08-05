'use client';

import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import ChatWindow from './ChatWindow';
import styles from '../../styles/chat/Chat.module.css';
import { useStomp } from '../../context/StompClientProvider';
import { getCookie } from 'cookies-next';

export default function ChatController() {
    const [isOpen, setIsOpen] = useState(false);
    const { connect, isConnected } = useStomp();

    const handleToggleChat = () => {
        const token = getCookie('access_token');
        if (token == null) {
            alert('로그인 후 이용 가능합니다.');
            return;
        }

        if (!isOpen && !isConnected) {
            connect({ Authorization: `Bearer ${token}` }, () => setIsOpen(true));
            return;
        }

        setIsOpen(prev => !prev);
    };

    return (
        <div className={styles.chatContainer}>
            {isConnected && <ChatWindow isOpen={isOpen} />}
            <button onClick={handleToggleChat} className={styles.chatToggleButton} aria-label="채팅">
                <FaCommentDots size={24} />
            </button>
        </div>
    );
}
