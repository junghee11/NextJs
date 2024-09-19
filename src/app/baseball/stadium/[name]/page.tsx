import styles from "../../../../styles/baseball/stadium-info.module.css"
import { getTeam, getStadiumInfo } from "../../../../service/baseball/apis";
import TeamSelector from "../../../../components/baseball/team-selector";


interface IParams {
    params : {name:string}
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name,
    }
}

export default async function StadiumInfo({params : {name}} : IParams) {
    // 팀별로 경기장 불러오기
    const type = name == "all" ? "all" : "team";
    const stadiums = await getStadiumInfo(type, name);

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} />
        </div>
        {stadiums.result.map(stadium => <div className={styles.stadium} key={stadium.idx}>
                    <h3>▶ {stadium.name}({stadium.team})</h3>
                    <p>{stadium.address}</p>
                    <p>티켓예매링크 : <a href={stadium.ticket_link}>{stadium.ticket_link}</a></p>
                </div>)}
    </div>;
}