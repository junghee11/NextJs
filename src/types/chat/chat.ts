import { TeamCode } from "../baseball/team";

export interface ChatRoom {
    id: string;
    roomName: string;
    roomType: string;
    createdBy: string;
    participants: string[];
    isActive: boolean;
    createdAt: string;
    messageCount : number, 
}

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    receiverId: string;
    type: string;
    content: string;
    createdAt: string;
}

export interface ChatRoomListResponse {
    result: ChatRoom[];
}

export interface ChatMessageListResponse {
    result: ChatMessage[];
}