import { TeamCode } from "../../types/baseball/team";
import serverApi from "../ServerApiClient"
import { TeamDetailResponse } from "../../types/baseball/team";
import { StadiumListResponse } from "../../types/baseball/stadium";
import { PlayerListResponse } from "../../types/baseball/player";
import { ArticleListResponse, CommentListResponse } from "../../types/community/community";
import { CartListResponse, GoodsListResponse, ReceiptListResponse, ReceiptDetailResponse } from "../../types/baseball/goods";

export const getMyTeamInfoServer = async () => {
    return await serverApi.get<TeamDetailResponse>(`/mypage/baseball/team`);
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
    return await serverApi.get<StadiumListResponse>(`/mypage/baseball/stadium`);
}

export const toggleStadiumServer = async (stadiumId: number) => {
    return await serverApi.patch(`/mypage/baseball/stadium/${stadiumId}`);
}

export const getMyPlayerListServer = async () => {
    return await serverApi.get<PlayerListResponse>(`/mypage/baseball/player`);
}

export const togglePlayerServer = async (playerId: number) => {
    return await serverApi.patch(`/mypage/baseball/player/${playerId}`);
}

export const getMyArticleListServer = async () => {
    return await serverApi.get<ArticleListResponse>(`/mypage/article`);
}

export const getMyCommentListServer = async () => {
    return await serverApi.get<CommentListResponse>(`/mypage/comment`);
} 

export const getMyCartListServer = async () => {
    return await serverApi.get<CartListResponse>(`/mypage/shop/cart`);
} 

export const getMyWishListServer = async () => {
    return await serverApi.get<GoodsListResponse>(`/mypage/shop/wish`);
} 

export const getMyPurchaseListServer = async () => {
    return await serverApi.get<ReceiptListResponse>(`/mypage/shop/purchase`);
} 

export const getMyReceiptDetailServer = async (receiptId : string) => {
    return await serverApi.get<ReceiptDetailResponse>(`/mypage/shop/purchase/${receiptId}`);
} 