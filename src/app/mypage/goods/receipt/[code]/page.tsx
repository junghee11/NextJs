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
            <div>
                <p>내역이 조회되지 않습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <table>
                <thead></thead>
                <tbody>
                    {orderMenuList.result.map((orderMenu: any) => <tr key={orderMenu.goodsCode}>
                        <Link href={"/baseball/goods/detail/" + orderMenu.goodsCode}>
                            <td><img src={orderMenu.imgUrl} alt="상품이미지" /> </td>
                            <td>{orderMenu.name} </td>
                            <td>결제금액<br/>{orderMenu.price}</td>   
                            <td>수량<br/>{orderMenu.count}</td>     
                        </Link>
                    </tr>)}
                </tbody>
            </table>           
        </div>
    </div>;
}