import { TeamCode } from "./team";

export interface Player {
    idx: number;
    name: string;
    num: number;
    position: string;
    birth: string;
    body: string;
    team: TeamCode;
    awards: string;
    song: string;
    imgUrl: string;
    pay: number;
    hit: number;
    homeRun: number;
    run: number;
    inning: string;
    fourBall: string;
}

export interface PlayerListResponse {
    result: Player[];
    page: number;
}
