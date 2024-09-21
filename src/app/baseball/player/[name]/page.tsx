import styles from "../../../../styles/baseball/player-info.module.css"
import { getTeam, getPlayerInfo } from "../../../../service/baseball/apis";
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

export default async function PlayerInfo({params : {name}} : IParams) {
    const type = name == "all" ? "all" : "team";
    const players = await getPlayerInfo(type, name);

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} />
        </div>
        <div className={styles.playerBox}>
            {players.result.map(player => <div className={styles.player} key={player.idx}>
                    <img src={player.img_url} alt="선수이미지" />
                    <h2>{player.name}({player.num}) - {player.team}</h2>
                    <br />
                    <p>생년월일 : {player.birth}</p>
                    <p>체격 : {player.body}</p>
                    <p>포지션 : {player.position}</p>
                    <br />
                    <p>[수상이력]</p>
                    <pre>{player.awards}</pre>
                    <br />
                    <p>[시즌 실적]</p>
                    <table>
                        <thead>
                            <tr>
                                <th>안타</th>
                                <th>홈런</th>
                                <th>타점</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{player.hit}</th>
                                <th>{player.homeRun}</th>
                                <th>{player.run}</th>
                            </tr>
                        </tbody>
                    </table>
                    <p>[응원가]</p>       
                    <br />         
                    <p>{player.song}</p>                
                </div>)}
            </div>
    </div>;
}