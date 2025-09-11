import { TeamCode } from "../../types/baseball/team";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export const getTeam = async (name : string) => {
    const response = await api.get(`/baseball/team/${name.toUpperCase()}`)
    return response;
}

export const getMatchSchedule = async (team : string, date? : string) => {
    return await api.get(`/baseball/schedule/${team.toUpperCase()}?date=${date}`);
}

export const getStadiumInfo = async (type: string, keyword : string) => {
    if(!type) {
        return await api.get(`/baseball/stadium?type=all`);
    } else {
        return await api.get(`/baseball/stadium?type=${type}&keyword=${keyword}`);
    }
}

export const getPlayerInfo = async (type: string, keyword : string, page : number) => {
    return await api.get(`/baseball/player?type=${type}&page=${page}&keyword=${keyword}`);
}

export const getRestaurantInfo = async (id: number) => {
    return await api.get(`/baseball/restaurant/${id}`);
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