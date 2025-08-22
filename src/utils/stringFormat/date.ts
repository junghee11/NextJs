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

    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);

        if (betweenTime > 0) {
            diff = diff - ( betweenTime * value.milliSeconds );
            rtnData = `${betweenTime}${value.time}` + " ";
            break;
        }
    }

    if( rtnData == "" )
    {
        rtnData = "방금";
    }

    return rtnData;
}

export const dateToString = (format:string, date : Date) => {
    return format.replace(/(yyyy|mm|dd|MM|DD|H|i|s)/g, (t: string): any => {
        switch (t) {
            case "yyyy":
                return date.getFullYear();
            case "mm":
                return date.getMonth() + 1;
            case "dd":
                return date.getDate();
            case "MM":
                return String(date.getMonth() + 1).padStart(2, '0');
            case "DD":
                return String(date.getDate()).padStart(2, '0');
            case "H":
                return String(date.getHours()).padStart(2, '0');
            case "i":
                return String(date.getMinutes()).padStart(2, '0');
            case "s":
                return String(date.getSeconds()).padStart(2, '0');
            default:
                return "";
        }
    });
}