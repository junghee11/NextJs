import styles from "../../../../../styles/goods/goods-info.module.css"
import { getGoodsDetail } from "../../../../../service/goods/apis";
import GoodsActions from "../../../../../components/goods/GoodsActions";
import { GoodsDetailResponse } from "../../../../../types/baseball/goods"

interface IParams {
    params : {id:string}
}

export default async function GoodsInfo({params : {id}} : IParams) {
    const goods : GoodsDetailResponse = await getGoodsDetail(id);

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0, 
        }).format(number);
    };

    return <div className={styles.container}>
        <div className={styles.goodsBox}>
            <div className={styles.goods}>
                <img src={goods.result.imgUrl} alt="굿즈" />
            </div>
            <div className={styles.goods}>
                <p>{goods.result.name}</p>
                <p>{goods.result.team}</p>
                <div>
                    <pre></pre>
                    <p>총 상품금액 : <span>{formatNumber(goods.result.price)}</span> 원</p>
                    <p>적립포인트 : {goods.result.pointRate}% ({formatNumber(goods.result.price/100*goods.result.pointRate)}p)</p>
                    <GoodsActions 
                        goodsCode={goods.result.goodsCode}
                        goodsName={goods.result.name}
                        price={goods.result.price}
                    />
                </div>
            </div>
        </div>
        <div className={styles.desc}>
            <br />
            <div>
                <span>상세정보</span>
                <span>리뷰</span>
                <span>Q&A</span>
                <span>반품/교환정보</span>
            </div>
            <pre>{goods.result.description}</pre>
        </div>
    </div>;
}