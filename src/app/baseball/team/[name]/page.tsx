import styles from "../../../(home)/home.module.css"
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

    return <div className={styles.container}>
        <table>
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
                {teams.result.map(team => <tr>
                    <td>{team.rank}</td>
                    <td>{team.name}</td>
                    <td>{team.win}</td>
                    <td>{team.loose}</td>
                    <td>{team.draw}</td>
                    <table>
                        <thead></thead>
                    </table>
                </tr>)}
            </tbody>
        </table>
    </div>;
}