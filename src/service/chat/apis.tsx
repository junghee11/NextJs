import api from "../ApiClient"
import { FriendListResponse } from "../../types/user/user";
import { ChatRoomListResponse, ChatMessageListResponse } from "../../types/chat/chat";

export const getChatFriends = async () => {
    return await api.get<FriendListResponse>('/mypage/chat/friend');
}

export const getChatRoom = async () => {
    return await api.get<ChatRoomListResponse>(`/mypage/chat/room`);
}

export const getChatMessages = async (roomId : string, page : number) => {
    return await api.get<ChatMessageListResponse>(`/mypage/chat/message?roomId=${roomId}&page=${page}`);
}

export const leaveChatRoom = async (roomId : string) => {
    return await api.delete(`/mypage/chat/room/${roomId}`);
}