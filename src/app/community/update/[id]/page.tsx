import { cookies } from "next/headers";
import { getUserInfo } from "../../../../service/user/apis";
import { getArticle } from "../../../../service/community/apis";
import styles from "../../../../styles/article/article.module.css"
import { redirect } from "next/navigation";
import UpdateArticle from "../../../../components/article/updateArticle";

interface IParams {
    params: { id: number }
}

export default async function updateArticle({ params: { id } }: IParams) {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const userInfo = await getUserInfo(access_token);
    const article = await getArticle(id);
    if (userInfo == null || userInfo.result.userId != article.result.userId) {
        console.log("게시글 수정은 작성자 본인만 가능합니다");
        redirect("/");
    } 

    return <div className={styles.container}>
        <UpdateArticle 
            articleId={article.result.idx} 
            articleTitle={article.result.title} 
            articleContent={article.result.content}>
        </UpdateArticle>
    </div>;
}