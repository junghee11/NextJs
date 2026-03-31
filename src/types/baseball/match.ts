import { TeamCode } from "./team";

export interface MatchDto {
    idx: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    homeImgUrl: string;
    awayImgUrl: string;
    stadium: string;
    matchResult: string;
    matchDate: string;
    matchTime: string;
}

export interface MatchListResponse {
    result: MatchDto[];
}
