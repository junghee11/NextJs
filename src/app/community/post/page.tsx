import { cookies } from "next/headers";
import { getUserInfo } from "../../../service/user/apis";

import styles from "../../../styles/article/article.module.css"
import PostArticle from "../../../components/article/postArticle";
import Login from "../../../components/user/login";


export default async function postArticle() {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const userInfo = await getUserInfo(access_token);
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