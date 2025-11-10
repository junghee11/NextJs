'use client';

import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import ChatWindow from './ChatWindow';
import styles from '../../styles/chat/Chat.module.css';
import { useStomp } from '../../context/StompClientProvider';
import { getCookie } from "cookies-next";

export default function ChatController() {
    const [isOpen, setIsOpen] = useState(false);
    const { connect, isConnected } = useStomp();

    const handleToggleChat = () => {
        if (!isOpen && !isConnected) {
            const token = getCookie('access_token');
            if (token == null) {
                alert("로그인 후 이용 가능합니다.");
                return;
            }
            const connectHeaders = { Authorization: `Bearer ${token}` };
            connect(connectHeaders, () => {
                setIsOpen(true);
            });
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className={styles.chatContainer}>
            {isOpen && isConnected && <ChatWindow />}
            <button onClick={handleToggleChat} className={styles.chatToggleButton}>
                <FaCommentDots size={24} />
            </button>
        </div>
    );
}