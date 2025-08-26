import { TeamCode } from "../../types/baseball/team";
import api from "../ApiClient"

export const dynamic = 'force-dynamic';
export const getTeam = async (name : string) => {
    const response = await api.get(`/baseball/team/${name.toUpperCase()}`)
    return response;
}

export const getArticleList = async (category : string, page : number) => {
    return await api.get(`/article?category=${category}&page=${page}`);
}

export const getArticle = async (id : number) => {
    return await api.get(`/article/${id}`);
}

export const getCommentList = async (articleId : number, commentId : number) => {
    if (commentId == null) {
        return await api.get(`/article/comments?id=${articleId}&page=1`);
    } else {
        return await api.get(`/article/comments?id=${articleId}&page=1&commentId=${commentId}`);
    }
}

export const postArticle = async (category : string, title: string, content : string, imageUrls?: string[]) => {
    const result = await api.post(`/article`, {
            category: category,
            title: title,
            content : content,
            imageUrls: imageUrls || []
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error;
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
            return error;
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

export const addComment = async (articleId : number, commentId : number, content : string) => {
    const result = await api.post(`/article/comment`, {
            articleId: articleId,
            commentId: commentId,
            content : content
        }).then(response => {
            return response;
        })
        .catch(error => {
            return error;
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

export const uploadArticleImage = async (articleImage : FormData) => {
    return await api.post(`/article/image`, articleImage, {
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