import styles from "../../../../styles/mypage/mypage.module.css"
import { getMyWishListServer } from "../../../../service/mypage/serverApis";
import Category from "../../../../components/mypage/category";
import Link from "next/link";

export default async function MyWishList() {
    const wishList = await getMyWishListServer();

    if (wishList.result.length == 0) {
        return <div className = {styles.container}>
            <Category></Category>
            <div>
                <p>찜한 상품이 없습니다</p>
            </div>
        </div>
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <table>
                <thead></thead>
                <tbody>
                    {wishList.result.map((wish: any) => <tr key={wish.goodsCode}>
                        <Link href={"/baseball/goods/detail/" + wish.goodsCode}>
                            <td><img src={wish.imgUrl} alt="" /></td>
                            <td>{wish.name} </td>
                            <td>상품금액<br/>{wish.price}</td>                        
                            <td>수량<br/>{wish.count}</td>   
                        </Link>                     
                    </tr>)}
                </tbody>
            </table>           
        </div>
    </div>;
}