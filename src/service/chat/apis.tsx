import api from "../ApiClient"

export const dynamic = 'force-dynamic';

export const getChatFriends = async () => {
    return await api.get('/mypage/chat/friend');
}

export const getChatRoom = async () => {
    return await api.get(`/mypage/chat/room`);
}

export const getChatMessages = async (roomId : string, page : number) => {
    return await api.get(`/mypage/chat/message?roomId=${roomId}&page=${page}`);
}