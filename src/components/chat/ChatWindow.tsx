'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import styles from '../../styles/chat/Chat.module.css';
import { FaUsers, FaCommentAlt, FaBars, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { useStomp } from '../../context/StompClientProvider';
import { getUserInfo } from '../../service/user/apis';
import { getChatFriends, getChatRoom, getChatMessages, leaveChatRoom, createChatRoom } from '../../service/chat/apis';
import { ChatRoom, ChatMessage } from '../../types/chat/chat';
import { User, UserInfoResponse } from '../../types/user/user';
import { SubscriptionHandle } from '../../hook/useStompClient';
import ProfileModal from './ProfileModal';
import ErrorModal from './ErrorModal';
import MemberPickerModal from './MemberPickerModal';
import {
    TOPIC_PUBLIC,
    topicChatRoom,
    QUEUE_PRIVATE_ROOM,
    QUEUE_ERRORS,
    appSendMessage,
    appInviteRoom,
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
    const [groupPickerOpen, setGroupPickerOpen] = useState(false);
    const [invitePickerRoom, setInvitePickerRoom] = useState<ChatRoom | null>(null);

    const { publish, subscribe, onError } = useStomp();
    const roomSubsRef = useRef<Map<string, SubscriptionHandle>>(new Map());
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const selectedRoomRef = useRef<string | null>(null);
    const toastIdCounter = useRef(0);
    const openSeqRef = useRef(0);
    const [creatingRoomLabel, setCreatingRoomLabel] = useState<string | null>(null);
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingOlderRef = useRef(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
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
            if (seq !== openSeqRef.current) return; 

            const fetched = messageList?.result || [];
            hasMoreRef.current = fetched.length > 0;
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

    const upsertRoom = useCallback((room: ChatRoom) => {
        setRooms(prev => {
            if (prev.some(r => r.id === room.id)) return prev;
            return [...prev, { ...room, messageCount: room.messageCount || 0 }];
        });
    }, []);

    const createAndOpenRoom = useCallback(async (
        roomType: 'DIRECT' | 'GROUP',
        roomName: string,
        participantIds: string[],
        label: string,
    ) => {
        setActiveNav('rooms');
        setSelectedRoom(null);
        setChatList([]);
        setCreatingRoomLabel(label);

        try {
            const response = await createChatRoom(roomType, roomName, participantIds);
            const room = response?.room;
            if (!room) {
                setError('대화방 생성 응답이 올바르지 않습니다.');
                return;
            }
            upsertRoom(room);
            handleOpenChatRoom(room.id);
        } catch (err) {
            showError(err, '대화방을 만들지 못했습니다.');
        } finally {
            setCreatingRoomLabel(null);
        }
    }, [upsertRoom, handleOpenChatRoom, showError]);

    useEffect(() => {
        const publicSub = subscribe(TOPIC_PUBLIC, msg => showToast(msg.body));

        const roomQueueSub = subscribe(QUEUE_PRIVATE_ROOM, msg => {
            const room: ChatRoom = JSON.parse(msg.body);

            upsertRoom(room);
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
    }, [subscribe, onError, showToast, upsertRoom]);

    useEffect(() => {
        const currentIds = new Set(rooms.map(r => r.id));

        rooms.forEach(room => {
            if (roomSubsRef.current.has(room.id)) return;

            const sub = subscribe(topicChatRoom(room.id), msg => {
                const newMessage: ChatMessage = JSON.parse(msg.body);
                const isMine = newMessage.senderId === myInfoRef.current?.userId;
                const isSystem = newMessage.type === 'LEAVE' || newMessage.type === 'ENTER';
                const isRoomVisible = isOpenRef.current && room.id === selectedRoomRef.current;

                if (newMessage.type === 'LEAVE') {
                    if (isMine) {
                        setRooms(prev => prev.filter(r => r.id !== room.id));
                        if (selectedRoomRef.current === room.id) {
                            setSelectedRoom(null);
                            setChatList([]);
                        }
                        return;
                    }
                    
                    setRooms(prev => prev.map(r =>
                        r.id === room.id
                            ? { ...r, participants: (r.participants || []).filter(p => p !== newMessage.senderId) }
                            : r
                    ));
                }

                if (newMessage.type === 'ENTER') {
                    setRooms(prev => prev.map(r => {
                        if (r.id !== room.id) return r;
                        const participants = r.participants || [];
                        return participants.includes(newMessage.senderId)
                            ? r
                            : { ...r, participants: [...participants, newMessage.senderId] };
                    }));
                }

                if (room.id === selectedRoomRef.current) {
                    appendMessage(newMessage);
                }

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

    useEffect(() => {
        const roomSubs = roomSubsRef.current;
        return () => {
            roomSubs.forEach(sub => sub.unsubscribe());
            roomSubs.clear();
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
            setActiveNav('rooms');
            handleOpenChatRoom(existingRoom.id);
            return;
        }

        createAndOpenRoom('DIRECT', friend.nickname, [friend.userId], `${friend.nickname}님과의 대화방`);
    }, [rooms, handleOpenChatRoom, createAndOpenRoom]);

    const handleCreateGroupChat = useCallback((members: User[]) => {
        setGroupPickerOpen(false);
        if (members.length === 0) return;

        const label = members.map(m => m.nickname).join(', ');
        createAndOpenRoom('GROUP', label, members.map(m => m.userId), `${label}님과의 그룹 대화방`);
    }, [createAndOpenRoom]);

    const handleInviteMembers = useCallback((members: User[]) => {
        const room = invitePickerRoom;
        setInvitePickerRoom(null);
        if (!room || members.length === 0) return;

        if (room.roomType === 'DIRECT') {
            const others = (room.participants || []).filter(id => id !== myInfo?.userId);
            const groupMemberIds = Array.from(new Set([...others, ...members.map(m => m.userId)]));
            const label = groupMemberIds.map(id => nicknameByUserId.get(id) || id).join(', ');

            createAndOpenRoom('GROUP', label, groupMemberIds, `${label}님과의 그룹 대화방`);
            return;
        }

        publish(appInviteRoom(room.id), { receiverIds: members.map(m => m.userId) });
    }, [invitePickerRoom, myInfo, nicknameByUserId, publish, createAndOpenRoom]);

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

    const getRoomDisplayName = (room: ChatRoom) => {
        const others = (room.participants || []).filter(id => id !== myInfo?.userId);
        
        if (others.length === 0) return '(대화상대 없음)';
        
        if (room.roomType === 'DIRECT') {
            return nicknameByUserId.get(others[0]) || room.roomName || others[0];
        }
        return room.roomName;
    };

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
                <button
                    className={styles.navBottomButton}
                    onClick={() => setGroupPickerOpen(true)}
                    title="그룹채팅 만들기"
                    aria-label="그룹채팅 만들기"
                >
                    <FaUserPlus size={20} />
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
                                title={getRoomDisplayName(room)}
                            >
                                {getRoomDisplayName(room)}
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
                        <span className={styles.chatHeaderTitle} title={getRoomDisplayName(currentRoom)}>{getRoomDisplayName(currentRoom)}</span>
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
                                    className={styles.inviteButton}
                                    onClick={() => { setInvitePickerRoom(currentRoom); setRoomMenuOpen(false); }}
                                >
                                    <FaUserPlus /> 초대하기
                                </button>
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
                    ) : creatingRoomLabel ? (
                        <div className={styles.noRoomSelected}>
                            <p>{creatingRoomLabel}을 여는 중...</p>
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
        {groupPickerOpen && (
            <MemberPickerModal
                title="그룹채팅 만들기"
                description="대화할 회원을 선택해주세요."
                confirmLabel="대화 시작"
                candidates={friends.filter(f => f.userId !== myInfo?.userId)}
                onConfirm={handleCreateGroupChat}
                onClose={() => setGroupPickerOpen(false)}
            />
        )}
        {invitePickerRoom && (
            <MemberPickerModal
                title="대화상대 초대"
                description={invitePickerRoom.roomType === 'DIRECT'
                    ? '1:1 대화방에서 초대하면 새로운 그룹채팅방이 만들어집니다.'
                    : '이 대화방에 초대할 회원을 선택해주세요.'}
                confirmLabel="초대"
                candidates={friends.filter(f =>
                    f.userId !== myInfo?.userId && !(invitePickerRoom.participants || []).includes(f.userId)
                )}
                onConfirm={handleInviteMembers}
                onClose={() => setInvitePickerRoom(null)}
            />
        )}
        {error && (
            <ErrorModal message={error} onClose={() => setError(null)} />
        )}
        </>
    );
}
