import styles from "../../../../styles/baseball/player-info.module.css"
import { getTeam, getPlayerInfo } from "../../../../service/baseball/apis";
import { getUserInfo } from "../../../../service/user/serverApis";
import TeamSelector from "../../../../components/baseball/team-selector";
import ServerPagination from "../../../../components/common/ServerPagination";
import FavoritePlayerButton from "../../../../components/baseball/FavoritePlayerButton";
import { profileImageUrlFormat } from "../../../../utils/stringFormat/image";


interface IParams {
    params : { name?: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({params : {name}} : IParams) {
    const team = await getTeam(name);
    return {
        title: "all" == name ? "team" : team.result.name,
    }
}

export default async function PlayerInfo({params : {name}, searchParams} : IParams) {
    const page = Number(searchParams?.page) || 1;
    const type = name == "all" ? "all" : "team";
    const players = await getPlayerInfo(type, name, page);
    const userInfo = await getUserInfo();
    const favoritePlayers : Set<number> = new Set<number>(userInfo?.result.player);

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} selectedDate="null"/>
        </div>
        <div className={styles.playerBox}>
            {players.result.map(player => <div className={styles.player} key={player.idx}>
                    <div className={styles.playerHeader}>
                        <div className={styles.playerImageContainer}>
                            <img src={profileImageUrlFormat(player.img_url)} alt={`${player.name} 선수이미지`} />
                        </div>
                        <div className={styles.playerInfo}>
                            <h2 className={styles.playerName}>
                                {player.name}
                                <span className={styles.playerNumber}>{player.num}</span>
                            </h2>
                            <h3 className={styles.playerTeam}>{player.team}</h3>
                        </div>
                        <FavoritePlayerButton 
                            playerIdx={player.idx} 
                            plaeyrName={player.name}
                            toggle={favoritePlayers.delete(player.idx)}
                        />
                    </div>
                    
                    <div className={styles.playerDetails}>
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>생년월일</div>
                            <p className={styles.detailValue}>{player.birth}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>체격</div>
                            <p className={styles.detailValue}>{player.body}</p>
                        </div>
                        <div className={styles.detailItem}>
                            <div className={styles.detailLabel}>포지션</div>
                            <p className={styles.detailValue}>{player.position}</p>
                        </div>
                    </div>

                    <div className={styles.statsSection}>
                        <h4 className={styles.sectionTitle}>시즌 실적</h4>
                        <table className={styles.statsTable}>
                            <thead>
                                <tr>
                                    <th>안타</th>
                                    <th>홈런</th>
                                    <th>타점</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{player.hit}</td>
                                    <td>{player.homeRun}</td>
                                    <td>{player.run}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.awardsSection}>
                        <h4 className={styles.sectionTitle}>수상이력</h4>
                        <pre className={styles.awardsContent}>{player.awards}</pre>
                    </div>

                    <div className={styles.songSection}>
                        <h4 className={styles.sectionTitle}>응원가</h4>
                        <div className={styles.songContent}>{player.song}</div>
                    </div>
                </div>)}
            </div>
        <ServerPagination
            currentPage={page}
            totalPages={players.page}
            basePath={`/baseball/player/${name}`}
        />
    </div>;
}