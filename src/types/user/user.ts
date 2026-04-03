export interface User {
    userId: string;
    nickname: string;
    name: string;
    role: string;
    profileImgUrl: string;
    team: string | null;
    phone: string;
    point: number;
    grade: string;
    player: number[];
}

export interface UserInfoResponse {
    result: User;
}

export interface FriendListResponse {
    result: User[];
}

export interface UserLoginResponse {
    token: string;
}

export interface MessageResponse {
    message: string;
}

export interface FindUserIdResponse {
    userId: string;
}

export interface FindUserPwResponse {
    tempPw: string;
    message: string;
}
