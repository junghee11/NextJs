import { TeamCode } from "../../types/baseball/team";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';

export const getGoodsList = async (team: TeamCode, page : number, order : string) => {
    return await api.get(`/shop/goods?team=${team}&page=${page}&order=${order}`);
}

export const getGoodsDetail = async (goodsCode: string) => {
    return await api.get(`/shop/goods/${goodsCode}`);
}

export const purchaseGoods = async (goodsCode : string, count : number, payType : string) => {
    return await api.post(`/shop/goods`, {
        id : goodsCode,
        count : count,
        payType : payType
    });
}

export const addCart = async (id : string, count : number) => {
    return await api.post(`/shop/goods/cart`, {
        id : id,
        count : count
    });
}

export const toggleWish = async (id : string) => {
    return await api.post(`/shop/goods/wish/${id}`, {
        id : id
    });
}