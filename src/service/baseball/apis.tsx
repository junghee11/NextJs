import { TeamCode } from "../../types/baseball/team";
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

export const getPlayerInfo = async (type: string, keyword : string) => {
    if(!type) {
        return await api.get(`/baseball/player?type=all`);
    } else {
        return await api.get(`/baseball/player?type=${type}&keyword=${keyword}`);
    }
}

export const getRestaurantInfo = async (id: number) => {
    return await api.get(`/baseball/restaurant/${id}`);
}

export const getGoodsList = async (team: TeamCode, page : number, order : string) => {
    return await api.get(`/shop/goods?team=${team}&page=${page}&order=${order}`);
}

export const getGoodsDetail = async (idx: number) => {
    return await api.get(`/shop/goods/${idx}`);
}

export const purchaseGoods = async (idx: number, page : number, payType : string) => {
    return await api.post(`/shop/goods`, {
        id :idx,
        count : page,
        payType : payType
    });
}