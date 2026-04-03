'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import styles from '../../styles/chat/Chat.module.css';
import { FaUsers, FaCommentAlt } from 'react-icons/fa';
import { useStomp } from '../../context/StompClientProvider';
import { getUserInfo } from "../../service/user/apis";
import { getChatFriends, getChatRoom, getChatMessages} from '../../service/chat/apis';
import { ChatRoom, ChatMessage } from '../../types/chat/chat';

type NavType = 'users' | 'rooms';
type Toast = { id: number; message: string };

interface UserInfo {
    result: {
        userId: string;
        nickname: string;
    };
}

interface Friend {
    userId: string;
    nickname: string;
}

export default function ChatWindow() {
    const [myInfo, setMyInfo] = useState<UserInfo | null>(null);
    const [activeNav, setActiveNav] = useState<NavType>('rooms');
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messageAllCount, setMessageAllCount] = useState(0);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [chatList, setChatList] = useState<ChatMessage[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const { publish, subscribe } = useStomp();
    const subscriptions = useRef(new Map());
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const selectedRoomRef = useRef<string | null>(null);
    const toastIdCounter = useRef(0);

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userInfo, friendList, roomList] = await Promise.all([
                    getUserInfo(),
                    getChatFriends(),
                    getChatRoom()
                ]);

                setMyInfo(userInfo as UserInfo);
                setFriends(friendList.result || []);

                const initialRooms = roomList.result.map((room: ChatRoom) => ({
                    ...room,
                    messageCount: room.messageCount || 0,
                }));

                setRooms(initialRooms);
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            }
        };

        fetchData();
    }, []);

    const showToast = useCallback((message: string) => {
        const id = toastIdCounter.current++;

        setToasts(prev => [...prev, { id, message }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 1000);
    }, []);

    useEffect(() => {
        if (!subscribe) return;

        const publicSubscription = subscribe('/topic/public', message => {
            showToast(message.body);
        });

        return () => {
            publicSubscription?.unsubscribe();
        };
    }, [subscribe, showToast]);

    useEffect(() => {
        if (rooms.length === 0 || !subscribe) return;

        rooms.forEach(room => {
            if (subscriptions.current.has(room.id)) return;

            const subscription = subscribe(`/topic/chat/${room.id}`, message => {
                const newMessage = JSON.parse(message.body);
                const currentSelectedRoom = selectedRoomRef.current;

                if (room.id === currentSelectedRoom) {
                    setChatList(prevChatList => [...prevChatList, newMessage]);
                } else {
                    setRooms(prevRooms =>
                        prevRooms.map(r =>
                            r.id === room.id
                                ? { ...r, messageCount: r.messageCount + 1 }
                                : r
                        )
                    );
                    setMessageAllCount(prevCount => prevCount + 1);
                }
            });

            subscriptions.current.set(room.id, subscription);
        });

        return () => {
            const currentRoomIds = new Set(rooms.map(r => r.id));
            subscriptions.current.forEach((subscription, roomId) => {
                if (!currentRoomIds.has(roomId)) {
                    subscription?.unsubscribe();
                    subscriptions.current.delete(roomId);
                }
            });
        };
    }, [rooms, subscribe]); 
    
    const handleUserButton = useCallback(() => {
        setActiveNav('users');
    }, []);

    const handleRoomButton = useCallback(() => {
        setActiveNav('rooms');
    }, []);

    const handleOpenChatRoom = useCallback(async (roomId: string) => {
        try {
            const targetRoom = rooms.find(r => r.id === roomId);
            const unreadCount = targetRoom?.messageCount || 0;

            setSelectedRoom(roomId);

            const messageList = await getChatMessages(roomId, 1);

            if (unreadCount > 0) {
                setMessageAllCount(prevCount => Math.max(0, prevCount - unreadCount));
            }

            setRooms(prevRooms =>
                prevRooms.map(r =>
                    r.id === roomId ? { ...r, messageCount: 0 } : r
                )
            );

            setChatList((messageList as any)?.result || []);
        } catch (error) {
            console.error('채팅 메시지 로딩 실패:', error);
            setChatList([]);
        }
    }, [rooms]);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '' || !selectedRoom) return;
        publish?.(`/app/chat.sendMessage/${selectedRoom}`, {"content": message});

        setMessage('');
    }, [message, selectedRoom, publish]);

    const handleStartChat = useCallback(async (friend: Friend) => {
        if (!myInfo) {
            alert('사용자 정보를 불러오는 중입니다.');
            return;
        }

        if (window.confirm(`${friend.nickname}님과 채팅을 시작하시겠습니까?`)) {
            try {
                const userIds: string[] = [myInfo.result.userId, friend.userId].sort();
                const roomId = `DM_${userIds[0]}_${userIds[1]}`;

                const existingRoom = rooms.find(room => room.id === roomId);

                if (existingRoom) {
                    await handleOpenChatRoom(roomId);
                } else {
                    publish?.(`/app/chat.privateMessage`, {"receiverId": friend.userId});

                    const newRoom: ChatRoom = {
                        id: roomId,
                        roomName: friend.nickname,
                        roomType: "DIRECT",
                        messageCount: 0,
                        participants: userIds,
                        createdBy: myInfo.result.userId,
                        createdAt: new Date().toISOString(),
                        isActive: true,
                    };
                    setRooms(prevRooms => [...prevRooms, newRoom]);
                    setSelectedRoom(roomId);
                    setChatList([]);
                }
                setActiveNav('rooms');
            } catch (error) {
                console.error('채팅방 시작에 실패했습니다.', error);
                alert('채팅방을 시작하는 중 오류가 발생했습니다.');
            }
        }
    }, [myInfo, rooms, handleOpenChatRoom, publish]);

    useEffect(() => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    }, [chatList]);

    return (
        <div className={styles.chatWindow}>
            <div className={styles.chatNav}>
                <button onClick={handleUserButton} className={activeNav === 'users' ? styles.active : ''}>
                    <FaUsers size={24} />
                </button>
                <button onClick={handleRoomButton} className={activeNav === 'rooms' ? styles.active : ''}>
                    <FaCommentAlt size={24} />
                    {messageAllCount > 0 &&
                    <span className={styles.messageAllCount}>{messageAllCount}</span>}
                </button>
            </div>
            <div className={styles.chatList}>
                {activeNav === 'users' && (
                    <ul>
                        {friends.map(user => (
                            <li key={user.userId} onClick={() => handleStartChat(user)}>
                                {user.nickname}
                            </li>
                        ))}
                    </ul>
                )}
                {activeNav === 'rooms' && (
                    <ul>
                        {rooms.map(room => (
                            <li
                                key={room.id}
                                onClick={() => handleOpenChatRoom(room.id)}
                                className={selectedRoom === room.id ? styles.selectedRoom : ''}
                                title={room.roomName}
                            >
                                {room.roomName}
                                {room.messageCount > 0 &&
                                    <span className={styles.messageCount}>{room.messageCount}</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className={styles.chatMain}>
                <div className={styles.messageArea} ref={messageAreaRef}>
                    {selectedRoom ? (
                        chatList.length > 0 ? (
                            chatList.map(msg => (
                                <div
                                    key={msg.id}
                                    className={myInfo && msg.senderId === myInfo.result.userId ? styles.myMessage : styles.otherMessage}
                                >
                                    <strong>{msg.senderId}</strong>
                                    <p>{msg.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noRoomSelected}>
                                <p>메시지가 없습니다.</p>
                            </div>
                        )
                    ) : (
                        <div className={styles.noRoomSelected}>
                            <p>채팅방을 선택해주세요.</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSendMessage} className={styles.messageInputForm}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={selectedRoom ? "메시지를 입력하세요..." : "채팅방을 먼저 선택해주세요."}
                        disabled={!selectedRoom}
                    />
                    <button type="submit" disabled={!selectedRoom}>전송</button>
                </form>
            </div>
            {toasts.length > 0 && (
                <div className={styles.toastContainer}>
                    {toasts.map(toast => (
                        <div key={toast.id} className={styles.toast}>
                            {toast.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}