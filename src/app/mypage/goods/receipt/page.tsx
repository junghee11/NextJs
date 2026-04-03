export const dynamic = 'force-dynamic';

import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyPurchaseListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyReceiptList() {
    const receiptList = await getMyPurchaseListServer();

    if (receiptList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div className = {styles.content}>
                <div className={styles.emptyState}>
                    <div className={styles.icon}>🧾</div>
                    <h3>구매내역이 없습니다</h3>
                    <p>첫 번째 상품을 구매해보세요!</p>
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
            <h2>구매내역</h2>
            <div>
                {receiptList.result.map((receipt: any) => 
                    <Link key={receipt.receiptCode} href={"receipt/" + receipt.receiptCode} className={styles.orderCard}>
                        <div className={styles.orderHeader}>
                            <div className={styles.orderDate}>
                                {new Date(receipt.createdAt).toLocaleDateString()}
                            </div>
                            <div className={`${styles.orderStatus} ${receipt.status ? styles.completed : styles.cancelled}`}>
                                {receipt.status ? "결제완료" : "취소"}
                            </div>
                        </div>
                        <div className={styles.orderInfo}>
                            <div className={styles.orderDetail}>
                                <strong>주문번호</strong>
                                <span>{receipt.receiptCode}</span>
                            </div>
                            <div className={styles.orderDetail}>
                                <strong>구매상품</strong>
                                <span>{receipt.desc}</span>
                            </div>
                            <div className={styles.orderDetail}>
                                <strong>결제금액</strong>
                                <span className={styles.orderPrice}>{receipt.totalPrice.toLocaleString()}원</span>
                            </div>
                        </div>
                    </Link>
                )}
            </div>          
        </div>
    </div>;
}