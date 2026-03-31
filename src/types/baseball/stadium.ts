import { TeamCode } from "./team";

export interface Stadium {
    idx: number;
    name: string;
    address: string;
    team: TeamCode;
    phone: string;
    ticketLink: string;
    imgUrl: string;
    sit: number;
    open: string;
    desc: string;
}

export interface Restaurant {
    idx: number;
    name: string;
    stadium: number;
    inside: boolean;
    star: number;
    address: string;
    up: number;
    down: number;
    phone: string;
    openingHours: string;
    website: string;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;

}

export interface Food {
    idx: number;
    restaurantsId: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    idx: number;
    restaurantsId: number;
    star: number;
    content: string;
    userId: string;
    state: number;
    nickname: string;
    createdAt: string;
}

export interface StadiumDetailResponse {
    result: Stadium;
    restaurants: Restaurant[];
}

export interface StadiumListResponse {
    result: Stadium[];
}

export interface RestaurantDetailResponse {
    result: Restaurant;
    food: Food[];
    review: Review[];
}
