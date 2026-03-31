import styles from "../../../../styles/goods/goods.module.css"
import { getGoodsList } from "../../../../service/goods/apis";
import TeamSelector from "../../../../components/baseball/team-selector";
import { TeamCode } from "../../../../types/baseball/team";
import { GoodsListResponse } from "../../../../types/baseball/goods"
import Link from "next/link";


interface IParams {
    params : {name:TeamCode}
}

export default async function GoodsList({params : {name}} : IParams) {
    const GoodsList : GoodsListResponse = (await getGoodsList(name, 1, "idx")) || { result: [], totalCount : 0 };
    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0, 
        }).format(number);
    };

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} selectedDate={null} />
        </div>
        <div className={styles.goodsBox}>
            {GoodsList.result.map(goods => <div className={styles.goods} key={goods.idx}>
                <Link href={"detail/" + goods.goodsCode}>
                    <img src={goods.imgUrl} alt="굿즈" />
                    <p>{goods.team}</p>
                    <h3>{goods.name}</h3>
                    <p>{formatNumber(goods.price)}</p>
                </Link>
            </div>)}
        </div>
    </div>;
}