import getMatchSchedule from "../../service/baseball/apis";
import styles from "../../styles/baseball/schedule.module.css";
import Link from "next/link";

interface IMatchProps {
    team : string;
}

export default async function Match({team} : IMatchProps) {
    const schedules = await getMatchSchedule(team.toUpperCase());

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

    // return <div className={styles.container}>
    //     <table>
    //         {/* <thead>
    //             <tr>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //                 <th></th>
    //             </tr>
    //         </thead> */}
    //         <tbody>
    //             {schedules.result.map(schedule => <tr key={schedule.idx}>
    //                 <td>{schedule.matchDate}</td>
    //                 <td>{schedule.matchTime}</td>
    //                 <td><img src={schedule.homeImgUrl} alt={schedule.homeTeam} /> </td>
    //                 <td>{schedule.homeTeam}</td>
    //                 <td>{schedule.homeScore}</td>
    //                 <td> : </td>
    //                 <td>{schedule.awayScore}</td>
    //                 <td><img src={schedule.awayImgUrl} alt={schedule.awayTeam} /> </td>
    //                 <td>{schedule.awayTeam}</td>
    //                 <td>{schedule.stadium}</td>
    //                 <td><Link prefetch href={`../match/${schedule.idx}`}>{schedule.matchResult}</Link></td>
    //             </tr>)}
    //         </tbody>
    //     </table>
    // </div>
}