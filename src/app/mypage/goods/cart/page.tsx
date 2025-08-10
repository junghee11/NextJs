import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyCartListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyCartList() {
    const cartList = await getMyCartListServer();

    if (cartList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>장바구니가 비었습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <table>
                <thead></thead>
                <tbody>
                    {cartList.result.map((cart: any) => <tr key={cart.goodsCode}>
                    <Link href={"/baseball/goods/detail/" + cart.goodsCode}>
                        <td><img src={cart.imgUrl} alt="" /></td>
                        <td>{cart.name} </td>
                        <td>상품금액<br/>{cart.price}</td>                        
                        <td>수량<br/>{cart.count}</td>                        
                    </Link></tr>)}
                </tbody>
            </table>           
        </div>
    </div>;
}