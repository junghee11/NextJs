export const dynamic = 'force-dynamic';

import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyTeamInfoServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import SelectMyTeamButton from "../../../../components/mypage/selectMyTeamButton";


export default async function MyTeamInfo() {
    const teamInfo = await getMyTeamInfoServer();

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <SelectMyTeamButton myTeam={null}/>
            
            <div className={styles.teamInfoCard}>
                <img src={teamInfo.result.imgUrl} alt="team logo"/>
                <h3>{teamInfo.result.name}</h3>
                <div className={styles.teamRank}>현재 {teamInfo.result.rank}위</div>
                
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <strong>승수</strong>
                        <span>{teamInfo.result.win}승</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>패수</strong>
                        <span>{teamInfo.result.loose}패</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>감독</strong>
                        <span>{teamInfo.result.director}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>홈구장</strong>
                        <span>{teamInfo.result.stadium}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>팀 소개</strong>
                        <span>{teamInfo.result.outline}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>홈페이지</strong>
                        <span>{teamInfo.result.homepage || "정보 없음"}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
}