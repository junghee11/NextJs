import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyPurchaseListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyReceiptList() {
    const receiptList = await getMyPurchaseListServer();

    if (receiptList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>결제내역이 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <table>
                <thead></thead>
                <tbody>
                    {receiptList.result.map((receipt: any) => <Link key={receipt.receiptCode} href={"receipt/" + receipt.receiptCode}>
                        <tr>                    
                            <td>결제일 <br /> {receipt.createdAt.split('T')[0]}</td>     
                            <td>주문번호 <br /> {receipt.receiptCode}</td>     
                            <td>구매상품 <br /> {receipt.desc}</td>     
                            <td>결제금액<br/>{receipt.totalPrice}</td>                        
                            <td>{receipt.status ? "결제완료" : "취소"}</td> 
                        </tr>
                    </Link>)}
                </tbody>
            </table>           
        </div>
    </div>;
}