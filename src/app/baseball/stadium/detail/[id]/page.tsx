import styles from "../../../../../styles/baseball/stadium-detail.module.css"
import { getStadiumInfo } from "../../../../../service/baseball/apis";


interface IParams {
    params : {id:string}
}

export default async function StadiumInfo({params : {id}} : IParams) {
    const stadium = await getStadiumInfo("id", id);

    return <div className={styles.container}>
        <div className={styles.stadiumMain}>
            <div className={styles.stadiumImageContainer}>
                <img src={stadium.result.imgUrl} alt={`${stadium.result.name} 경기장`} />
            </div>
            <div className={styles.stadiumInfo}>
                <h1 className={styles.stadiumTitle}>
                    {stadium.result.name}
                    <span className={styles.teamBadge}>{stadium.result.team}</span>
                </h1>
                
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>전화번호</div>
                        <div className={styles.infoValue}>{stadium.result.phone}</div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>개장일</div>
                        <div className={styles.infoValue}>{stadium.result.open}</div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>주소</div>
                        <div className={styles.infoValue}>{stadium.result.address}</div>
                    </div>
                    <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>좌석수</div>
                        <div className={styles.infoValue}>{stadium.result.sit}석</div>
                    </div>
                </div>

                <div className={styles.ticketLink}>
                    <a href={stadium.result.ticketLink} target="_blank" rel="noopener noreferrer">
                        🎫 티켓 예매하기
                    </a>
                </div>

                <div className={styles.description}>
                    {stadium.result.desc}
                </div>
            </div>
        </div>

        <div className={styles.restaurantsSection}>
            <h2 className={styles.sectionTitle}>주변 식당</h2>
            <div className={styles.restaurantGrid}>
                {stadium.restaurants.map(restaurant => 
                    <div className={styles.restaurantCard} key={restaurant.idx}>
                        <h3 className={styles.restaurantName}>
                            <a href={"../restaurant/" + restaurant.idx}>
                                {restaurant.name}
                            </a>
                            <span className={`${styles.locationBadge} ${restaurant.inside ? styles.inside : styles.outside}`}>
                                {restaurant.inside ? "경기장 내부" : "경기장 외부"}
                            </span>
                        </h3>
                        
                        <div className={styles.ratingContainer}>
                            <div className={styles.starRating}>
                                {restaurant.star}
                            </div>
                            <div className={styles.thumbsContainer}>
                                <span className={styles.thumbUp}>👍 {restaurant.up}</span>
                                <span className={styles.thumbDown}>👎 {restaurant.down}</span>
                            </div>
                        </div>

                        <div className={styles.restaurantDetails}>
                            <p className={styles.restaurantHours}>{restaurant.openingHours}</p>
                            <p className={styles.restaurantAddress}>{restaurant.address}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>;
}