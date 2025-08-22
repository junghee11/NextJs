import { getUserInfo } from "../../../service/user/serverApis";

import styles from "../../../styles/article/article.module.css"
import PostArticle from "../../../components/article/postArticle";
import Login from "../../../components/user/login";


export default async function postArticle() {
    const userInfo = await getUserInfo();
    if (userInfo == null) {
        return <div className={styles.container}>
            <div className={styles.articleBox}>
                <div className={styles.error}>로그인 후 이용해주세요</div>
                <div style={{textAlign: "center", marginTop: "20px"}}>
                    <Login></Login>
                </div>
            </div>
        </div>;
    }    

    return <div className={styles.container}>
        <PostArticle></PostArticle>
    </div>;
}