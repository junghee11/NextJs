import { TeamCode } from "../baseball/team";

export interface Article {
    idx: number;
    category: string;
    title: string;
    content: string;
    userId: string;
    state: number;
    viewCount: number;
    commentCount: number;
    createdAt: string;
}

export interface Comment {
    idx: number;
    content: string;
    userId: string;
    depth: number;
    state: number;
    up: number;
    down: number;
    myUp: boolean;
    myDown: boolean;
    commentCount: number;
    createdAt: string;
    nickname: string;
    profileImage: string;
    grade: number;
}

export interface ArticleListResponse {
    result: Article[];
}

export interface ArticleDetailResponse {
    result: Article;
}

export interface CommentListResponse {
    result: Comment[];
    page: number;
}

export interface AddCommentResponse {
    result: Comment;
    message: string;
}

export interface UploadImageResponse {
    imageUrl: string;
}
