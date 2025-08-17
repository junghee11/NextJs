import { TeamCode } from "../../types/baseball/team";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';

export const getMyTeamInfo = () => {
    return api.get(`/mypage/baseball/team`);
}

export const selectMyTeam = async (team: TeamCode) => {
    const result = await api.patch(`/mypage/baseball/team`, {
            team: team
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error.response.data.message;
        });
    
    return result;
}

export const getMyStadiumList = async () => {
    return await api.get(`/mypage/baseball/stadium`);
}

export const toggleStadium = async (stadiumId: number) => {
    return await api.patch(`/mypage/baseball/stadium/${stadiumId}`);
}

export const getMyPlayerList = async () => {
    return await api.get(`/mypage/baseball/player`);
}

export const togglePlayer = async (playerId: number) => {
    return await api.patch(`/mypage/baseball/player/${playerId}`);
}

export const getMyArticleList = async () => {
    return await api.get(`/mypage/article`);
}

export const getMyCommentList = async () => {
    return await api.get(`/mypage/comment`);
}

export const leaveSite = async () => {
    return await api.post(`/user/leave`).then(response => {
        return response;
    })
    .catch(error => {
        return error.response.data.message;
    });    
}

export const changeProfileImage = async (profileImage : FormData) => {
    return await api.post(`/mypage/profile/image`, profileImage, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        return response;
    })
    .catch(error => {
        return error;
    })
}