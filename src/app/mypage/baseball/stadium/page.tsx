import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyStadiumListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";

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
            {stadiumList.result.map(stadium => <div key={stadium.idx}>
                <img src={stadium.imgUrl} alt="" />
                <div>
                    <h3><a href={"detail/" + stadium.idx}>▶ {stadium.name}({stadium.team})</a></h3>
                    <p>{stadium.address}</p>
                    <p>티켓예매링크 : <a href={stadium.ticketLink}>{stadium.ticketLink}</a></p>
                </div>
            </div>)}
        </div>
    </div>;
}