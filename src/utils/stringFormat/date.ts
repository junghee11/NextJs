export const elapsedTime = (date) => {
    const start : Date = new Date(date);
    const curr : Date = new Date(); 

    let diff : number = (curr.getTime() - start.getTime()); 

    const times = [
        {time: "초 전", milliSeconds: 1000},
        {time: "분 전", milliSeconds: 1000 * 60},
        {time: "시간 전", milliSeconds: 1000 * 60 * 60},
        {time: "일 전", milliSeconds: 1000 * 60 * 60 * 24},
        {time: "개월 전", milliSeconds: 1000 * 60 * 60 * 24 * 30},
        {time: "년 전", milliSeconds: 1000 * 60 * 60 * 24 * 365},
    ].reverse();

    var rtnData = "";

    // 년 단위부터 경과 시간 계산 , 알맞는 단위 삽입.
    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);

        if (betweenTime > 0) {
            diff = diff - ( betweenTime * value.milliSeconds );
            rtnData = `${betweenTime}${value.time}` + " ";
            break;
        }
    }

    // 모든 단위가 맞지 않을 시
    if( rtnData == "" )
    {
        rtnData = "방금";
    }

    return rtnData;
}