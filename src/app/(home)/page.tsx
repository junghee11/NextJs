import styles from "../(home)/home.module.css"
import Login from "../../components/user/login";
import { getUserInfo } from "../../service/user/apis";

export const metadata = {
    title : "Home",
}

export default async function HomePage() {
    // TODO: userInfo 결과에 따른 홈페이지 다르도록 수정하기
    // const userInfo = await getUserInfo();
    return <div>
        <div className={styles.container}>
            <img src="/images/logo.png" alt="I ❤ baseball"/>
            <p>Welcome!</p>
            <p>팀을 응원해주세요 ❤</p>
            <Login></Login>
            {/* <UserInfo></UserInfo> */}
        </div>
    </div>
}