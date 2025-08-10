import { TeamCode } from "../../types/baseball/team";
import serverApi from "../ServerApiClient"

export const dynamic = 'force-dynamic';

export const getMyTeamInfoServer = async () => {
    return await serverApi.get(`/mypage/baseball/team`);
}

export const selectMyTeamServer = async (team: TeamCode) => {
    const result = await serverApi.patch(`/mypage/baseball/team`, {
            team: team
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error.response?.data?.message || error;
        });
    
    return result;
}

export const getMyStadiumListServer = async () => {
    return await serverApi.get(`/mypage/baseball/stadium`);
}

export const toggleStadiumServer = async (stadiumId: number) => {
    return await serverApi.patch(`/mypage/baseball/stadium/${stadiumId}`);
}

export const getMyPlayerListServer = async () => {
    return await serverApi.get(`/mypage/baseball/player`);
}

export const togglePlayerServer = async (playerId: number) => {
    return await serverApi.patch(`/mypage/baseball/player/${playerId}`);
}

export const getMyArticleListServer = async () => {
    return await serverApi.get(`/mypage/article`);
}

export const getMyCommentListServer = async () => {
    return await serverApi.get(`/mypage/comment`);
} 

export const getMyCartListServer = async () => {
    return await serverApi.get(`/mypage/shop/cart`);
} 

export const getMyWishListServer = async () => {
    return await serverApi.get(`/mypage/shop/wish`);
} 

export const getMyPurchaseListServer = async () => {
    return await serverApi.get(`/mypage/shop/purchase`);
} 

export const getMyReceiptDetailServer = async (receiptId : string) => {
    return await serverApi.get(`/mypage/shop/purchase/${receiptId}`);
} 