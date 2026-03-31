export interface User {
    userId: number;
    nickname: string;
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
