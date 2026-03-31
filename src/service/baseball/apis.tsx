import { TeamDetailResponse, TeamListResponse } from "../../types/baseball/team";
import { PlayerListResponse } from "../../types/baseball/player";
import { MatchListResponse } from "../../types/baseball/match";
import { StadiumDetailResponse, StadiumListResponse, RestaurantDetailResponse } from "../../types/baseball/stadium";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export const getTeam = async (name : string) => {
    const response = await api.get<TeamDetailResponse>(`/baseball/team/${name.toUpperCase()}`)
    return response;
}

export const getTeamList = async () => {
    const response = await api.get<TeamListResponse>(`/baseball/team/ALL}`)
    return response;
}

export const getMatchSchedule = async (team : string, date? : string) => {
    return await api.get<MatchListResponse>(`/baseball/schedule/${team.toUpperCase()}?date=${date}`);
}

export const getStadiumInfo = async (keyword : string) => {
    return await api.get<StadiumDetailResponse>(`/baseball/stadium?type=id&keyword=${keyword}`);
}

export const getStadiumList = async (type: string, keyword : string) => {
    if(!type) {
        return await api.get<StadiumListResponse>(`/baseball/stadium?type=all`);
    } else {
        return await api.get<StadiumListResponse>(`/baseball/stadium?type=${type}&keyword=${keyword}`);
    }
}

export const getPlayerInfo = async (type: string, keyword : string, page : number) => {
    return await api.get<PlayerListResponse>(`/baseball/player?type=${type}&page=${page}&keyword=${keyword}`);
}

export const getRestaurantInfo = async (id: number) => {
    return await api.get<RestaurantDetailResponse>(`/baseball/restaurant/${id}`);
}

export const toggleStadium = async (idx : number) => {
    return await api.patch(`/mypage/baseball/stadium/${idx}`
    ).then(response => {
        if(response.toggle) {
            return response.toggle;
        }

        return false;
    }).catch(error => {
        if (error.status == 400) {
            alert("로그인 후 이용해주세요");
        } else if (error.message) {
            alert(error.message)
        } else {
            alert("오류가 발생했습니다")
        }

        return false;
    });
}

export const togglePlayer = async (idx : number) => {
    return await api.patch(`/mypage/baseball/player/${idx}`
    ).then(response => {
        if(response.toggle) {
            return response.toggle;
        }

        return false;
    }).catch(error => {
        if (error.status == 400) {
            alert("로그인 후 이용해주세요");
        } else if (error.message) {
            alert(error.message)
        } else {
            alert("오류가 발생했습니다")
        }

        return false;
    });
}