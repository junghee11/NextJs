import { getUserInfo } from "../../../../service/user/serverApis";
import { getArticle } from "../../../../service/community/apis";
import styles from "../../../../styles/article/article.module.css"
import { redirect } from "next/navigation";
import UpdateArticle from "../../../../components/article/updateArticle";
import LoginPopup from "../../../../components/common/LoginPopup";
import NotAllowPopup from "../../../../components/common/NotAllowPopup";

interface IParams {
    params: { id: number }
}

export default async function updateArticle({ params: { id } }: IParams) {
    const userInfo = await getUserInfo();
    if (userInfo == null) {
        return <LoginPopup></LoginPopup>
    } 
    
    const article = await getArticle(id);
    if (userInfo.result.userId != article.result.userId) {
        return <NotAllowPopup 
            message={"게시글은 작성자 본인만\n수정 가능합니다."}
            pathname={"/community/"+id}>
        </NotAllowPopup>
    } 

    return <div className={styles.container}>
        <UpdateArticle 
            articleId={article.result.idx} 
            articleTitle={article.result.title} 
            articleContent={article.result.content}>
        </UpdateArticle>
    </div>;
}