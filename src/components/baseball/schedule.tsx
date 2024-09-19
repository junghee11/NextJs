import { getMatchSchedule } from "../../service/baseball/apis";
import styles from "../../styles/baseball/schedule.module.css";
import Link from "next/link";

interface IMatchProps {
    team : string;
}

export default async function Match({team} : IMatchProps) {
    const schedules = await getMatchSchedule(team.toUpperCase());

    if (schedules.result.length == 0) {
        return <div>
            <div><p>오늘은 경기가 없습니다..</p></div>
        </div>
    } else {
        return <div className={styles.container}>
                {schedules.result.map(schedule => 
                <div key={schedule.idx}>
                    <p>{schedule.matchDate}</p>
                    <p>{schedule.matchTime}</p>
                    <p className={styles.match}>
                        <img src={schedule.homeImgUrl} alt={schedule.homeTeam} />
                        <span>{schedule.homeTeam}</span>
                        <span>{schedule.homeScore}</span>
                        <span> : </span>
                        <span> {schedule.awayScore} </span>
                        <img src={schedule.awayImgUrl} alt={schedule.awayTeam} />
                        <span>{schedule.awayTeam}</span>
                    </p>
                    <p>{schedule.stadium}</p>
                    <p><Link prefetch href={`../match/${schedule.idx}`}>{schedule.matchResult}</Link></p>
                </div>
                )}
            </div>
    }
}