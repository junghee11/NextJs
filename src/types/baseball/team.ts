export type TeamCode = "KIA" | "SAMSUNG" | "LG" | "DOOSAN" | "SSG" | "KT" | "HANHWA" | "LOTTE" 
| "NC" | "KIWOOM" ;

export type TeamName = "KIA 타이거즈" | "삼성 라이온즈" | "LG 트윈즈" | "두산 베어스" | "SSG 랜더스" 
| "KT wiz" | "한화 이글스" | "롯데 자이언츠" | "NC 디아노스" | "키움 히어로즈";

export const teamNameByCode : Map<TeamCode, TeamName> = new Map([
    ["KIA", "KIA 타이거즈"],
    ["SAMSUNG", "삼성 라이온즈"],
    ["LG", "LG 트윈즈"],
    ["DOOSAN", "두산 베어스"],
    ["SSG", "SSG 랜더스"],
    ["KT", "KT wiz"],
    ["HANHWA", "한화 이글스"],
    ["LOTTE", "롯데 자이언츠"],
    ["NC", "NC 디아노스"],
    ["KIWOOM", "키움 히어로즈"],
    
])