export const dynamic = 'force-dynamic';

import styles from "../../../../styles/mypage/mypage.module.css"
import playerStyles from "../../../../styles/baseball/player-info.module.css"
import { getMyPlayerListServer } from "../../../../service/mypage/serverApis";
import { getUserInfo } from "../../../../service/user/serverApis";
import LoginPopup from "../../../../components/common/LoginPopup";
import Category from "../../../../components/mypage/category";
import FavoritePlayerButton from "../../../../components/baseball/FavoritePlayerButton";
import { profileImageUrlFormat } from "../../../../utils/stringFormat/image";

export default async function MyPlayerList() {
    const userInfo = await getUserInfo();
    if (userInfo == null) {
        return <LoginPopup></LoginPopup>
    }
    const playerList = await getMyPlayerListServer();

    if (playerList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>응원중인 선수가 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <div className={playerStyles.playerBox}>
                {playerList.result.map(player => <div className={playerStyles.player} key={player.idx}>
                        <div className={playerStyles.playerHeader}>
                            <div className={playerStyles.playerImageContainer}>
                                <img src={profileImageUrlFormat(player.imgUrl)} alt={`${player.name} 선수이미지`} />
                            </div>
                            <div className={playerStyles.playerInfo}>
                                <h2 className={playerStyles.playerName}>
                                    {player.name}
                                    <span className={playerStyles.playerNumber}>{player.num}</span>
                                </h2>
                                <h3 className={playerStyles.playerTeam}>{player.team}</h3>
                            </div>
                            <FavoritePlayerButton 
                                playerIdx={player.idx} 
                                plaeyrName={player.name}
                                toggle={true}
                            />
                        </div>
                        
                        <div className={playerStyles.playerDetails}>
                            <div className={playerStyles.detailItem}>
                                <div className={playerStyles.detailLabel}>생년월일</div>
                                <p className={playerStyles.detailValue}>{player.birth}</p>
                            </div>
                            <div className={playerStyles.detailItem}>
                                <div className={playerStyles.detailLabel}>체격</div>
                                <p className={playerStyles.detailValue}>{player.body}</p>
                            </div>
                        </div>

                        <div className={playerStyles.statsSection}>
                            <h4 className={playerStyles.sectionTitle}>시즌 실적</h4>
                            <table className={playerStyles.statsTable}>
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

                        <div className={playerStyles.awardsSection}>
                            <h4 className={playerStyles.sectionTitle}>수상이력</h4>
                            <pre className={playerStyles.awardsContent}>{player.awards}</pre>
                        </div>

                        <div className={playerStyles.songSection}>
                            <h4 className={playerStyles.sectionTitle}>응원가</h4>
                            <div className={playerStyles.songContent}>{player.song}</div>
                        </div>
                    </div>)}
            </div>
        </div>
    </div>;
}