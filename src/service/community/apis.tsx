import { TeamCode } from "../../types/baseball/team";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export const getTeam = async (name : string) => {
    const response = await api.get(`/baseball/team/${name.toUpperCase()}`)
    return response;
}

export const getArticleList = async (category : string, team: TeamCode, page : number) => {
    return await api.get(`/article?category=${category}&page=${page}`);
}

export const getArticle = async (id : number) => {
    return await api.get(`/article/${id}`);
}

export const getCommentList = async (articleId : number) => {
    return await api.get(`/article/comments?id=${articleId}&page=1`);
}