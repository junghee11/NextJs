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

export const postArticle = async (category : string, title: string, content : string) => {
    const result = await api.post(`/article`, {
            category: category,
            title: title,
            content : content
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error.response.data.message;
        });
    
    return result;
}

export const updateArticle = async (id : number, title: string, content : string) => {
    const result = await api.patch(`/article`, {
            id: id,
            title: title,
            content : content
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error.response.data.message;
        });
    
    return result;
}

export const deleteArticle = async (id : number) => {
    const result = await api.delete(`/article/${id}`).then(response => {
            return response;
        })
        .catch(error => {
            return error.response;
        });
    
    return result;
}

export const addComment = async (articleId : number, content : string) => {
    const result = await api.post(`/article/comment`, {
            articleId: articleId,
            content : content
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error.response.data.message;
        });
    
    return result;
}

export const deleteComment = async (id : number) => {
    const result = await api.delete(`/article/comment/${id}`).then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
    
    return result;
}

export const toggleComment = async (commentId : number, recommend : string) => {
    const result = await api.patch(`/article/comment`, {
            commentId: commentId,
            recommend : recommend
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error;
        });
    
    return result;
}