import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyWishListServer } from "../../../../service/mypage/serverApis";
import { getUserInfo } from "../../../../service/user/serverApis"
import LoginPopup from "../../../../components/common/LoginPopup";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyWishList() {
    const userInfo = await getUserInfo();
        if (userInfo == null) {
            return <LoginPopup></LoginPopup>
        }

    const wishList = await getMyWishListServer();

    if (wishList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>💖</div>
                    <h3>찜한 상품이 없습니다</h3>
                    <p>마음에 드는 상품을 찜해보세요!</p>
                    <a href="/baseball/goods" className={styles.actionButton}>
                        상품 둘러보기
                    </a>
                </div>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <h2>찜 목록</h2>
            <div>
                {wishList.result.map((wish: any) => 
                    <Link key={wish.goodsCode} href={"/baseball/goods/detail/" + wish.goodsCode} className={styles.productCard}>
                        <img src={wish.imgUrl} alt={wish.name} />
                        <div className={styles.productInfo}>
                            <h3>{wish.name}</h3>
                            <div className={styles.price}>{wish.price.toLocaleString()}원</div>
                        </div>
                    </Link>
                )}
            </div>          
        </div>
    </div>;
}