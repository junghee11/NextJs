import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export const getTeam = async (name : string) => {
    const response = await api.get(`/baseball/team/${name.toUpperCase()}`)
    return response;
}

export const getMatchSchedule = async (team : string) => {
    const response = await api.get(`/baseball/schedule/${team.toUpperCase()}`)
    return response;
}

export const getStadiumInfo = async (type: string, keyword : string) => {
    if(!type) {
        return await api.get(`/baseball/stadium?type=all`);
    } else {
        return await api.get(`/baseball/stadium?type=${type}&keyword=${keyword}`);
    }
}