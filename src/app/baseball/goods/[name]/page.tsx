import styles from "../../../../styles/baseball/goods.module.css"
import { getGoodsList } from "../../../../service/baseball/apis";
import TeamSelector from "../../../../components/baseball/team-selector";
import { TeamCode } from "../../../../types/baseball/team";
import Link from "next/link";


interface IParams {
    params : {name:TeamCode}
}

export default async function GoodsList({params : {name}} : IParams) {
    const GoodsList = await getGoodsList(name, 1, "idx");

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0, 
        }).format(number);
    };

    return <div className={styles.container}>
        <div>
            <TeamSelector selectedTeam={name} />
        </div>
        <div className={styles.goodsBox}>
            {GoodsList.result.map(goods => <div className={styles.goods} key={goods.idx}>
                <Link href={"detail/" + goods.idx}>
                    <img src={goods.imgUrl} alt="굿즈" />
                    <p>{goods.team}</p>
                    <h3>{goods.name}</h3>
                    <p>{formatNumber(goods.price)}</p>
                </Link>
            </div>)}
        </div>
    </div>;
}