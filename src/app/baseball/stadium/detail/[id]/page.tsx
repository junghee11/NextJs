import styles from "../../../../../styles/baseball/stadium-detail.module.css"
import { getStadiumInfo } from "../../../../../service/baseball/apis";


interface IParams {
    params : {id:string}
}

export default async function StadiumInfo({params : {id}} : IParams) {
    const stadium = await getStadiumInfo("id", id);

    return <div className={styles.container}>
        <div>
            <div className={styles.stadium} key={stadium.result.idx}>
                    <img src={stadium.result.imgUrl} alt="경기장" />
                    <div>
                        <h3>{stadium.result.name} ({stadium.result.team})</h3>
                        <p>{stadium.result.phone}</p>
                        <p>{stadium.result.address}</p>
                        <p>개장일 : {stadium.result.open}}</p>
                        <p>좌석수 : {stadium.result.sit}}</p>
                        <p>티켓예매링크 : <a href={stadium.result.ticketLink}>{stadium.result.ticketLink}</a></p>
                        <p>{stadium.result.desc}</p>
                        </div>
                    </div>
        </div>
        <p>[주변식당]</p> <br />
        {stadium.restaurants.map(restaurant => <div className={styles.stadium} key={restaurant.idx}>
                    <h3>▶ <a href={"../restaurant/" + restaurant.idx}>{restaurant.name} (경기장 {restaurant.inside ? "내부" : "외부"}) </a></h3>
                    <p>
                        <span>⭐ {restaurant.star}</span>
                    </p>
                    <p>
                        <span>👍 {restaurant.up}</span>
                        <span>👎 {restaurant.down}</span>
                    </p>
                    <p>영업시간 : {restaurant.openingHours}</p>
                    <p>{restaurant.address}</p>
                    <p></p>
                </div>)}

                <br />
    </div>;
}