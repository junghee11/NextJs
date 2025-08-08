import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyTeamInfoServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import SelectMyTeamButton from "../../../../components/mypage/selectMyTeamButton";


export default async function MyTeamInfo() {
    const teamInfo = await getMyTeamInfoServer();

    return <div>
        <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <SelectMyTeamButton myTeam={true} teamCode="SAMSUNG"/>
                <img src={"/images/" + teamInfo.result.imgUrl} alt="profile"/>
                <p>팀을 응원해주세요 ❤</p>
                <p>{teamInfo.result.name}</p>
                <p>현재 {teamInfo.result.rank}위!</p>
                <p>{teamInfo.result.win}승</p>
                <p>{teamInfo.result.loose}패</p>
                <p>{teamInfo.result.director} 감독</p>
                <p>홈구장 {teamInfo.result.stadium}</p>
                <p>{teamInfo.result.outline}</p>
                <p>홈페이지 : {teamInfo.result.stadium}</p>
            </div>
        </div>
    </div>
}