import { cookies } from "next/headers";
import { getUserInfo } from "../../../service/user/apis";

import styles from "../../../styles/baseball/article.module.css"
import PostArticle from "../../../components/article/postArticle";
import Login from "../../../components/user/login";


export default async function postArticle() {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const userInfo = await getUserInfo(access_token);
    if (userInfo == null) {
        return <div className={styles.container}>
            <div style={{textAlign: "center", height: "100px", lineHeight: "100px"}}>로그인 후 이용해주세요</div>
            <div style={{textAlign: "center"}}>
                <Login></Login>
            </div>
        </div>;
    }    

    return <div className={styles.container}>
        <div className={styles.articleBox}>
            <h1>글 작성하기</h1>
            <PostArticle></PostArticle>
        </div>
    </div>;
}