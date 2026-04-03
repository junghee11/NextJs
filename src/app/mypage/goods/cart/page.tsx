export const dynamic = 'force-dynamic';

import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyCartListServer } from "../../../../service/mypage/serverApis";
import { getUserInfo } from "../../../../service/user/serverApis"
import Category from "../../../../components/mypage/category";
import LoginPopup from "../../../../components/common/LoginPopup";
import Link from "next/link";

export default async function MyCartList() {
    const userInfo = await getUserInfo();
        if (userInfo == null) {
            return <LoginPopup></LoginPopup>
        }
    
    const cartList = await getMyCartListServer();

    if (cartList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>🛒</div>
                    <h3>장바구니가 비었습니다</h3>
                    <p>원하는 상품을 장바구니에 담아보세요!</p>
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
            <h2>장바구니</h2>
            <div>
                {cartList.result.map((cart: any) => 
                    <Link key={cart.goodsCode} href={"/baseball/goods/detail/" + cart.goodsCode} className={styles.productCard}>
                        <img src={cart.imgUrl} alt={cart.name} />
                        <div className={styles.productInfo}>
                            <h3>{cart.name}</h3>
                            <div className={styles.price}>{cart.price.toLocaleString()}원</div>
                            <div className={styles.quantity}>수량: {cart.count}개</div>
                        </div>
                    </Link>
                )}
            </div>          
        </div>
    </div>;
}