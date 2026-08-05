'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styles from '../../styles/chat/Chat.module.css';
import { FaUsers, FaCommentAlt, FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useStomp } from '../../context/StompClientProvider';
import { getUserInfo } from '../../service/user/apis';
import { getChatFriends, getChatRoom, getChatMessages, leaveChatRoom } from '../../service/chat/apis';
import { ChatRoom, ChatMessage } from '../../types/chat/chat';
import { User, UserInfoResponse } from '../../types/user/user';
import { SubscriptionHandle } from '../../hook/useStompClient';
import ProfileModal from './ProfileModal';
import ErrorModal from './ErrorModal';
import {
    TOPIC_PUBLIC,
    topicChatRoom,
    QUEUE_PRIVATE_ROOM,
    QUEUE_ERRORS,
    appSendMessage,
    APP_PRIVATE_MESSAGE,
} from './chatConstants';

type NavType = 'users' | 'rooms';
type Toast = { id: number; message: string };
type MessageNotification = { id: number; senderId: string; content: string };

const TOAST_DURATION_MS = 3000;
const NOTIFICATION_DURATION_MS = 4000;

interface Props {
    isOpen: boolean;
}

export default function ChatWindow({ isOpen }: Props) {
    const [myInfo, setMyInfo] = useState<User | null>(null);
    const [activeNav, setActiveNav] = useState<NavType>('rooms');
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const [chatList, setChatList] = useState<ChatMessage[]>([]);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [notifications, setNotifications] = useState<MessageNotification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
    const [roomMenuOpen, setRoomMenuOpen] = useState(false);

    const { publish, subscribe, onError } = useStomp();
    const roomSubsRef = useRef<Map<string, SubscriptionHandle>>(new Map());
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const selectedRoomRef = useRef<string | null>(null);
    const toastIdCounter = useRef(0);
    const openSeqRef = useRef(0);
    const pendingDMReceiverRef = useRef<string | null>(null);
    const pendingDMTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [pendingDMFriend, setPendingDMFriend] = useState<User | null>(null);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingOlderRef = useRef(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    // 'bottom': 최하단으로 스크롤 / 'preserve': 과거 메시지 prepend 후 보던 위치 유지
    const scrollBehaviorRef = useRef<{ mode: 'bottom' | 'preserve'; prevScrollHeight: number; prevScrollTop: number }>({
        mode: 'bottom', prevScrollHeight: 0, prevScrollTop: 0,
    });
    const notificationIdCounter = useRef(0);
    const isOpenRef = useRef(isOpen);
    const myInfoRef = useRef<User | null>(null);

    useEffect(() => {
        selectedRoomRef.current = selectedRoom;
    }, [selectedRoom]);

    useEffect(() => {
        isOpenRef.current = isOpen;
        // 창을 다시 열면 보고 있던 방의 안읽음 카운트 해제
        if (isOpen && selectedRoomRef.current) {
            const roomId = selectedRoomRef.current;
            setRooms(prev => prev.map(r => r.id === roomId ? { ...r, messageCount: 0 } : r));
        }
    }, [isOpen]);

    useEffect(() => {
        myInfoRef.current = myInfo;
    }, [myInfo]);

    const totalUnread = useMemo(
        () => rooms.reduce((sum, room) => sum + (room.messageCount || 0), 0),
        [rooms]
    );

    const nicknameByUserId = useMemo(() => {
        const map = new Map<string, string>();
        friends.forEach(friend => map.set(friend.userId, friend.nickname));
        if (myInfo) map.set(myInfo.userId, myInfo.nickname);
        return map;
    }, [friends, myInfo]);

    const showError = useCallback((err: unknown, fallback: string) => {
        const msg = (err as { message?: string })?.message || fallback;
        setError(msg);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userInfo, friendList, roomList] = await Promise.all([
                    getUserInfo() as Promise<UserInfoResponse | null>,
                    getChatFriends(),
                    getChatRoom(),
                ]);

                setMyInfo(userInfo?.result ?? null);
                setFriends(friendList.result || []);
                setRooms((roomList.result || []).map((room: ChatRoom) => ({
                    ...room,
                    messageCount: room.messageCount || 0,
                })));
            } catch (err) {
                showError(err, '채팅 데이터를 불러오지 못했습니다.');
            }
        };

        fetchData();
    }, [showError]);

    const showToast = useCallback((message: string) => {
        const id = toastIdCounter.current++;
        setToasts(prev => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, TOAST_DURATION_MS);
    }, []);

    const appendMessage = useCallback((incoming: ChatMessage) => {
        setChatList(prev => prev.some(m => m.id === incoming.id) ? prev : [...prev, incoming]);
    }, []);

    const showNotification = useCallback((msg: ChatMessage) => {
        const id = notificationIdCounter.current++;
        setNotifications(prev => [...prev, { id, senderId: msg.senderId, content: msg.content }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, NOTIFICATION_DURATION_MS);
    }, []);

    const handleOpenChatRoom = useCallback(async (roomId: string) => {
        const seq = ++openSeqRef.current;

        setSelectedRoom(roomId);
        setChatList([]);
        setRoomMenuOpen(false);
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, messageCount: 0 } : r));
        pageRef.current = 1;
        hasMoreRef.current = true;
        scrollBehaviorRef.current = { mode: 'bottom', prevScrollHeight: 0, prevScrollTop: 0 };

        try {
            const messageList = await getChatMessages(roomId, 1);
            if (seq !== openSeqRef.current) return; // 다른 방을 열었으면 늦은 응답 무시

            const fetched = messageList?.result || [];
            hasMoreRef.current = fetched.length > 0;
            // 로드 중 실시간으로 도착해 이미 append된 메시지와 id 기준 병합 (유실 방지)
            setChatList(prev => {
                const fetchedIds = new Set(fetched.map(m => m.id));
                const arrivedDuringFetch = prev.filter(m => m.roomId === roomId && !fetchedIds.has(m.id));
                return [...fetched, ...arrivedDuringFetch];
            });
        } catch (err) {
            if (seq !== openSeqRef.current) return;
            showError(err, '채팅 메시지를 불러오지 못했습니다.');
        }
    }, [showError]);

    const loadOlderMessages = useCallback(async () => {
        const roomId = selectedRoomRef.current;
        if (!roomId || loadingOlderRef.current || !hasMoreRef.current) return;

        loadingOlderRef.current = true;
        setLoadingOlder(true);
        const seq = openSeqRef.current;
        const nextPage = pageRef.current + 1;

        try {
            const messageList = await getChatMessages(roomId, nextPage);
            if (seq !== openSeqRef.current) return; 

            const older = messageList?.result || [];
            if (older.length === 0) {
                hasMoreRef.current = false;
                return;
            }
            pageRef.current = nextPage;

            const area = messageAreaRef.current;
            scrollBehaviorRef.current = {
                mode: 'preserve',
                prevScrollHeight: area?.scrollHeight ?? 0,
                prevScrollTop: area?.scrollTop ?? 0,
            };

            setChatList(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                return [...older.filter(m => !existingIds.has(m.id)), ...prev];
            });
        } catch (err) {
            if (seq === openSeqRef.current) {
                showError(err, '이전 메시지를 불러오지 못했습니다.');
            }
        } finally {
            loadingOlderRef.current = false;
            setLoadingOlder(false);
        }
    }, [showError]);

    const handleMessageAreaScroll = useCallback(() => {
        const area = messageAreaRef.current;
        if (area && area.scrollTop <= 30) {
            loadOlderMessages();
        }
    }, [loadOlderMessages]);

    const clearPendingDM = useCallback(() => {
        pendingDMReceiverRef.current = null;
        setPendingDMFriend(null);
        if (pendingDMTimeoutRef.current) {
            clearTimeout(pendingDMTimeoutRef.current);
            pendingDMTimeoutRef.current = null;
        }
    }, []);

    const upsertRoom = useCallback((room: ChatRoom) => {
        setRooms(prev => {
            if (prev.some(r => r.id === room.id)) return prev;
            return [...prev, { ...room, messageCount: room.messageCount || 0 }];
        });
    }, []);

    useEffect(() => {
        const publicSub = subscribe(TOPIC_PUBLIC, msg => showToast(msg.body));

        const roomQueueSub = subscribe(QUEUE_PRIVATE_ROOM, msg => {
            const room: ChatRoom = JSON.parse(msg.body);
            upsertRoom(room);

            const pending = pendingDMReceiverRef.current;
            if (pending && room.participants?.includes(pending)) {
                clearPendingDM();
                setActiveNav('rooms');
                handleOpenChatRoom(room.id);
            }
        });

        const errorQueueSub = subscribe(QUEUE_ERRORS, msg => {
            try {
                const body = JSON.parse(msg.body);
                setError(body.message || msg.body);
            } catch {
                setError(msg.body);
            }
        });

        const removeErrorListener = onError(message => setError(message));

        return () => {
            publicSub.unsubscribe();
            roomQueueSub.unsubscribe();
            errorQueueSub.unsubscribe();
            removeErrorListener();
        };
    }, [subscribe, onError, showToast, upsertRoom, handleOpenChatRoom, clearPendingDM]);

    // 방 구독 동기화: 새 방 구독, 목록에서 빠진 방 해제
    useEffect(() => {
        const currentIds = new Set(rooms.map(r => r.id));

        rooms.forEach(room => {
            if (roomSubsRef.current.has(room.id)) return;

            const sub = subscribe(topicChatRoom(room.id), msg => {
                const newMessage: ChatMessage = JSON.parse(msg.body);
                const isMine = newMessage.senderId === myInfoRef.current?.userId;
                const isSystem = newMessage.type === 'LEAVE' || newMessage.type === 'ENTER';
                // 창이 열려 있고 해당 방을 보고 있는 경우에만 "읽은 것"으로 간주
                const isRoomVisible = isOpenRef.current && room.id === selectedRoomRef.current;

                if (newMessage.type === 'LEAVE') {
                    if (isMine) {
                        // 다른 탭/기기에서 내가 나간 경우 — 이 탭에서도 방 제거 (구독 해제는 rooms effect가 수행)
                        setRooms(prev => prev.filter(r => r.id !== room.id));
                        if (selectedRoomRef.current === room.id) {
                            setSelectedRoom(null);
                            setChatList([]);
                        }
                        return;
                    }
                    // 나간 유저를 참여자 목록에서 제거
                    setRooms(prev => prev.map(r =>
                        r.id === room.id
                            ? { ...r, participants: (r.participants || []).filter(p => p !== newMessage.senderId) }
                            : r
                    ));
                }

                if (room.id === selectedRoomRef.current) {
                    appendMessage(newMessage);
                }

                // 시스템 메시지(입장/퇴장)는 안읽음 카운트·알림 대상에서 제외
                if (!isRoomVisible && !isMine && !isSystem) {
                    setRooms(prev => prev.map(r =>
                        r.id === room.id ? { ...r, messageCount: (r.messageCount || 0) + 1 } : r
                    ));
                    showNotification(newMessage);
                }
            });
            roomSubsRef.current.set(room.id, sub);
        });

        roomSubsRef.current.forEach((sub, roomId) => {
            if (!currentIds.has(roomId)) {
                sub.unsubscribe();
                roomSubsRef.current.delete(roomId);
            }
        });
    }, [rooms, subscribe, appendMessage, showNotification]);

    // 언마운트 시 방 구독 전체 해제 (v1은 해제되지 않아 중복 수신 발생)
    useEffect(() => {
        const roomSubs = roomSubsRef.current;
        return () => {
            roomSubs.forEach(sub => sub.unsubscribe());
            roomSubs.clear();
            if (pendingDMTimeoutRef.current) {
                clearTimeout(pendingDMTimeoutRef.current);
            }
        };
    }, []);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() === '' || !selectedRoom) return;
        publish(appSendMessage(selectedRoom), { content: message });
        setMessage('');
    }, [message, selectedRoom, publish]);

    const handleStartDirectChat = useCallback((friend: User) => {
        setOpenMenuUserId(null);

        const existingRoom = rooms.find(room =>
            room.roomType === 'DIRECT' && room.participants?.includes(friend.userId)
        );

        if (existingRoom) {
            clearPendingDM();
            setActiveNav('rooms');
            handleOpenChatRoom(existingRoom.id);
            return;
        }

        clearPendingDM();
        pendingDMReceiverRef.current = friend.userId;
        setPendingDMFriend(friend);
        setActiveNav('rooms');
        setSelectedRoom(null);
        setChatList([]);
        publish(APP_PRIVATE_MESSAGE, { receiverId: friend.userId });

        pendingDMTimeoutRef.current = setTimeout(() => {
            if (pendingDMReceiverRef.current === friend.userId) {
                clearPendingDM();
                setError('대화방 응답이 없습니다. 잠시 후 다시 시도해주세요.');
            }
        }, 7000);
    }, [rooms, publish, handleOpenChatRoom, clearPendingDM]);

    const handleLeaveRoom = useCallback(async (roomId: string) => {
        if (!window.confirm('채팅방을 나가시겠습니까?')) return;

        try {
            await leaveChatRoom(roomId);
            roomSubsRef.current.get(roomId)?.unsubscribe();
            roomSubsRef.current.delete(roomId);
            setRooms(prev => prev.filter(r => r.id !== roomId));
            if (selectedRoomRef.current === roomId) {
                setSelectedRoom(null);
                setChatList([]);
            }
            setRoomMenuOpen(false);
        } catch (err) {
            showError(err, '채팅방 나가기에 실패했습니다.');
        }
    }, [showError]);

    useEffect(() => {
        const area = messageAreaRef.current;
        if (!area) return;

        const behavior = scrollBehaviorRef.current;
        if (behavior.mode === 'preserve') {
            area.scrollTop = area.scrollHeight - behavior.prevScrollHeight + behavior.prevScrollTop;
            scrollBehaviorRef.current = { mode: 'bottom', prevScrollHeight: 0, prevScrollTop: 0 };
        } else {
            area.scrollTop = area.scrollHeight;
        }
    }, [chatList]);

    const currentRoom = rooms.find(r => r.id === selectedRoom) ?? null;

    return (
        <>
        <div className={isOpen ? styles.chatWindow : styles.chatWindowHidden}>
            <div className={styles.chatNav}>
                <button onClick={() => setActiveNav('users')} className={activeNav === 'users' ? styles.active : ''} aria-label="회원 목록">
                    <FaUsers size={24} />
                </button>
                <button onClick={() => setActiveNav('rooms')} className={activeNav === 'rooms' ? styles.active : ''} aria-label="채팅방 목록">
                    <FaCommentAlt size={24} />
                    {totalUnread > 0 &&
                        <span className={styles.messageAllCount}>{totalUnread}</span>}
                </button>
            </div>
            <div className={styles.chatList}>
                {activeNav === 'users' && (
                    <ul>
                        {friends.map(user => (
                            <li
                                key={user.userId}
                                className={styles.friendItem}
                                onClick={() => setOpenMenuUserId(prev => prev === user.userId ? null : user.userId)}
                            >
                                {user.nickname}
                                {openMenuUserId === user.userId && (
                                    <div className={styles.userComboBox} onClick={e => e.stopPropagation()}>
                                        <button onClick={() => { setProfileUser(user); setOpenMenuUserId(null); }}>
                                            프로필 보기
                                        </button>
                                        <button onClick={() => handleStartDirectChat(user)}>
                                            1:1 대화하기
                                        </button>
                                    </div>
                                )}
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
                {currentRoom && (
                    <div className={styles.chatHeader}>
                        <span className={styles.chatHeaderTitle} title={currentRoom.roomName}>{currentRoom.roomName}</span>
                        <button
                            className={styles.chatHeaderMenuButton}
                            onClick={() => setRoomMenuOpen(prev => !prev)}
                            aria-label="채팅방 메뉴"
                        >
                            <FaBars size={18} />
                        </button>
                        {roomMenuOpen && (
                            <div className={styles.roomMenu}>
                                <div className={styles.roomMenuTitle}>참여자</div>
                                <ul className={styles.participantList}>
                                    {(currentRoom.participants || []).map(userId => (
                                        <li key={userId}>
                                            {nicknameByUserId.get(userId) || userId}
                                            {myInfo?.userId === userId && ' (나)'}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={styles.leaveButton}
                                    onClick={() => handleLeaveRoom(currentRoom.id)}
                                >
                                    <FaSignOutAlt /> 나가기
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className={styles.messageArea} ref={messageAreaRef} onScroll={handleMessageAreaScroll}>
                    {loadingOlder && (
                        <div className={styles.loadingOlder}>이전 메시지 불러오는 중...</div>
                    )}
                    {selectedRoom ? (
                        chatList.length > 0 ? (
                            chatList.map(msg => {
                                if (msg.type === 'LEAVE' || msg.type === 'ENTER') {
                                    const nickname = nicknameByUserId.get(msg.senderId) || msg.senderId;
                                    const fallback = msg.type === 'LEAVE'
                                        ? `${nickname}님이 나갔습니다.`
                                        : `${nickname}님이 입장했습니다.`;
                                    return (
                                        <div key={msg.id} className={styles.systemMessage}>
                                            {msg.content || fallback}
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        key={msg.id}
                                        className={myInfo && msg.senderId === myInfo.userId ? styles.myMessage : styles.otherMessage}
                                    >
                                        <strong>{nicknameByUserId.get(msg.senderId) || msg.senderId}</strong>
                                        <p>{msg.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.noRoomSelected}>
                                <p>메시지가 없습니다.</p>
                            </div>
                        )
                    ) : pendingDMFriend ? (
                        <div className={styles.noRoomSelected}>
                            <p>{pendingDMFriend.nickname}님과의 대화방을 여는 중...</p>
                        </div>
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
                        placeholder={selectedRoom ? '메시지를 입력하세요...' : '채팅방을 먼저 선택해주세요.'}
                        disabled={!selectedRoom}
                    />
                    <button type="submit" disabled={!selectedRoom}>전송</button>
                </form>
            </div>
        </div>
        {(toasts.length > 0 || notifications.length > 0) && (
            <div className={styles.toastContainer}>
                {toasts.map(toast => (
                    <div key={toast.id} className={styles.toast}>
                        {toast.message}
                    </div>
                ))}
                {notifications.map(notification => (
                    <div key={notification.id} className={styles.notificationToast}>
                        <strong>{nicknameByUserId.get(notification.senderId) || notification.senderId}</strong>
                        <p>{notification.content}</p>
                    </div>
                ))}
            </div>
        )}
        {profileUser && (
            <ProfileModal user={profileUser} onClose={() => setProfileUser(null)} />
        )}
        {error && (
            <ErrorModal message={error} onClose={() => setError(null)} />
        )}
        </>
    );
}
