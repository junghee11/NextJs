import styles from "../../../../styles/baseball/stadium-info.module.css"
import { getTeam, getStadiumList } from "../../../../service/baseball/apis";
import { getUserInfo } from "../../../../service/user/serverApis";
import TeamSelector from "../../../../components/baseball/team-selector";
import FavoriteStadiumButton from "../../../../components/baseball/FavoriteStadiumButton";
import { StadiumListResponse } from "../../../../types/baseball/stadium"


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
    const type = name == "all" ? "all" : "team";
    const stadiums : StadiumListResponse = await getStadiumList(type, name);
    const userInfo = await getUserInfo();
    const favoriteStadiums : Set<number> = new Set<number>(userInfo?.result.stadium)

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} selectedDate={null}/>
        </div>
        {stadiums.result.map(stadium => <div className={styles.stadium} key={stadium.idx}>
            <img src={stadium.imgUrl} alt={`${stadium.name} 경기장`} />
            <div className={styles.stadiumContent}>
                <div className={styles.stadiumHeader}>
                    <h3 className={styles.stadiumTitle}>
                        <a href={"detail/" + stadium.idx}>{stadium.name}({stadium.team})</a>
                    </h3>
                    <FavoriteStadiumButton 
                        stadiumIdx={stadium.idx} 
                        stadiumName={stadium.name}
                        toggle={favoriteStadiums.delete(stadium.idx)}
                    />
                </div>
                <p className={styles.stadiumAddress}>{stadium.address}</p>
                <p className={styles.ticketLink}>
                    티켓예매링크 : <a href={stadium.ticketLink} target="_blank" rel="noopener noreferrer">예매하기</a>
                </p>
            </div>
        </div>)}
    </div>;
}