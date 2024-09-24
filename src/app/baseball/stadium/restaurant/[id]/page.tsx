import styles from "../../../../../styles/baseball/restaurant-info.module.css"
import { getRestaurantInfo } from "../../../../../service/baseball/apis";


interface IParams {
    params : {id:number}
}

export default async function RestaurantInfo({params : {id}} : IParams) {
    const restaurant = await getRestaurantInfo(id);

    return <div className={styles.container}>
        <div>
            <div className={styles.restaurant} key={restaurant.result.idx}>
                <img src={restaurant.result.imgUrl} alt="식당" />
                <div>
                    <h3>▶ {restaurant.result.name} (경기장 {restaurant.result.inside ? "내부" : "외부"}) </h3>
                    <p>
                        <span>⭐ {restaurant.result.star}</span>
                    </p>
                    <p>
                        <span>👍 {restaurant.result.up}</span>
                        <span>👎 {restaurant.result.down}</span>
                    </p>
                    <p>{restaurant.result.phone}</p>
                    <p>영업시간 : {restaurant.result.openingHours}</p>
                    <p>{restaurant.result.address}</p>
                    <p>{restaurant.result.website ? "홈페이지 : " + restaurant.result.website :  ""}</p> 
                </div>
            </div>
        </div>
        <p>메뉴</p>
        <hr />
        {restaurant.food.map(food => <div className={styles.food} key={food.idx}>
                    <img src={food.imgUrl} alt={food.name} />
                    <div>
                        <h3> {food.name} </h3>
                        <p>{food.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p> 
                        <p>{food.description}</p>
                    </div>
                </div>)}

        <p>후기</p>
        <hr />
        <br />
        {restaurant.review.map(review => <div className={styles.review} key={review.idx}>
                    <h3> {review.nickname} </h3>
                    <p>
                        {Array(review.star)
                            .fill("⭐")
                            .map((star, index) => (
                                <span key={index}>{star}</span>
                            ))}
                    </p>
                    <p>{review.content}</p>
                </div>)}
    </div>;
}