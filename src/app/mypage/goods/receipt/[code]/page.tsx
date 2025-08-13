import styles from "../../../../../styles/mypage/mypage.module.css"
import { getMyReceiptDetailServer } from "../../../../../service/mypage/serverApis";
import Category from "../../../../../components/mypage/category";
import Link from "next/link";

interface IParams {
    params : {code:string}
}

export default async function MyPurchaseList({params : {code}} : IParams) {
    const orderMenuList = await getMyReceiptDetailServer(code);

    if (orderMenuList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>📋</div>
                    <h3>내역이 조회되지 않습니다</h3>
                    <p>주문번호를 다시 확인해주세요</p>
                    <a href="/mypage/goods/receipt" className={styles.actionButton}>
                        구매내역으로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <h2>주문상세 ({code})</h2>
            <div>
                {orderMenuList.result.map((orderMenu: any) => 
                    <Link key={orderMenu.goodsCode} href={"/baseball/goods/detail/" + orderMenu.goodsCode} className={styles.productCard}>
                        <img src={orderMenu.imgUrl} alt={orderMenu.name} />
                        <div className={styles.productInfo}>
                            <h3>{orderMenu.name}</h3>
                            <div className={styles.price}>{orderMenu.price.toLocaleString()}원</div>
                            <div className={styles.quantity}>수량: {orderMenu.count}개</div>
                        </div>
                    </Link>
                )}
            </div>          
        </div>
    </div>;
}