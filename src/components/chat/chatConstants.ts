// 구독 (수신)
export const TOPIC_PUBLIC = '/topic/public';
export const topicChatRoom = (roomId: string) => `/topic/chat/${roomId}`;
export const QUEUE_PRIVATE_ROOM = '/user/queue/chat.room';
export const QUEUE_ERRORS = '/user/queue/errors';

// 발행 (송신)
export const appSendMessage = (roomId: string) => `/app/chat.sendMessage/${roomId}`;
export const APP_PRIVATE_MESSAGE = '/app/chat.privateMessage';
