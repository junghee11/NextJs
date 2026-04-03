export const dynamic = 'force-dynamic';

import styles from "../../../../styles/mypage/mypage.module.css"
import stadiumStyle from "../../../../styles/baseball/stadium-info.module.css"
import { getMyStadiumListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import FavoriteStadiumButton from "../../../../components/baseball/FavoriteStadiumButton";

export default async function MyStadiumList() {
    const stadiumList = await getMyStadiumListServer();

    if (stadiumList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>자주가는 경기장이 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            {stadiumList.result.map(stadium => <div className={stadiumStyle.stadium} key={stadium.idx}>
                <img src={stadium.imgUrl} alt={`${stadium.name} 경기장`} />
                <div className={stadiumStyle.stadiumContent}>
                    <div className={stadiumStyle.stadiumHeader}>
                        <h3 className={stadiumStyle.stadiumTitle}>
                            <a href={"/baseball/stadium/detail/" + stadium.idx}>{stadium.name}({stadium.team})</a>
                        </h3>
                        <FavoriteStadiumButton 
                            stadiumIdx={stadium.idx} 
                            stadiumName={stadium.name}
                            toggle={true}
                        />
                    </div>
                    <p className={stadiumStyle.stadiumAddress}>{stadium.address}</p>
                    <p className={stadiumStyle.ticketLink}>
                        티켓예매링크 : <a href={stadium.ticketLink} target="_blank" rel="noopener noreferrer">예매하기</a>
                    </p>
                </div>
            </div>)}
        </div>
    </div>;
}