import styles from "../../styles/baseball/team-info.module.css";
import { getTeam } from "../../service/baseball/apis";


// TODO : 연결해줘야함. ALL이 아닌경우 팀별 상세정보 페이지 
export default async function teamInfo({name} : {name:string}) {
    const team = await getTeam(name);
    return <div className={styles.container}>
        <img src={team.img_url} 
        alt={team.name} 
        className={styles.poster}/>
        <div className={styles.info}>
            <h1 className={styles.title}>{team.name}</h1>
            <h2>⭐ {team.team_code}</h2>
            <img src={team.img_url} alt={team.team_code} />
            <ul>
                <li>순위 : {team.rank}</li>
                <li>승 : {team.win}</li>
                <li>패 : {team.loose}</li>
                <li>무승부 : {team.draw}</li>
            </ul>
            {/* <p>{team.overview}</p>
            <a href={team.homepage}
            target={"_blank"}>HomePage &rarr;</a> */}
        </div>
    </div>
}