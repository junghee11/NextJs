export type TeamCode = "SAMSUNG" | "SSG" | "KT" | "LG" | "NC" 
| "DOOSAN" | "KIWOOM" | "KIA";
export type TeamName = "삼성 라이온즈" | "SSG 랜더스" | "KT wiz" 
| "LG 트윈즈" | "NC 디아노스" | "두산 베어스" | "키움 히어로즈" | "KIA 타이거즈";

export const teamNameByCode : Map<TeamCode, TeamName> = new Map([
    ["SAMSUNG", "삼성 라이온즈"],
    ["SSG", "SSG 랜더스"],
    ["KT", "KT wiz"],
    ["LG", "LG 트윈즈"],
    ["NC", "NC 디아노스"],
    ["DOOSAN", "두산 베어스"],
    ["KIWOOM", "키움 히어로즈"],
    ["KIA", "KIA 타이거즈"],
])