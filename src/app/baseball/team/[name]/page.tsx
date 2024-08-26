import styles from "../../../../styles/baseball/team-info.module.css"
import { getTeam } from "../../../../service/baseball/apis";


interface IParams {
    params : {name:string}
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name,
    }
}

export default async function BaseBallMatchSchedule() {
    const teams = await getTeam("all");

    return <div>
        <table className={styles.container}>
            <thead>
                <tr>
                    <th>순위</th>
                    <th>팀명</th>
                    <th>승</th>
                    <th>무</th>
                    <th>패</th>
                </tr>
            </thead>
            <tbody>
                {teams.result.map(team => <tr key={team.idx}>
                    <td>{team.rank}</td>
                    <td><img src={team.imgUrl} alt={team.teamCode} /> {team.name}</td>
                    <td>{team.win}</td>
                    <td>{team.loose}</td>
                    <td>{team.draw}</td>                        
                </tr>)}
            </tbody>
        </table>
    </div>;
}