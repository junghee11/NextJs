import { cookies } from "next/headers";

import styles from "../(home)/home.module.css"
import Login from "../../components/user/login";
import UserInfo from "../../components/user/userInfo";
import { getUserInfo } from "../../service/user/apis";

export const metadata = {
    title : "Home",
}

export default async function HomePage() {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const userInfo = await getUserInfo(access_token);

    return <div>
        <div className = {styles.container}>
            <img src="/images/logo.png" alt="I ❤ baseball"/>
            <p>Welcome!</p>
            <p>팀을 응원해주세요 ❤</p>
            {userInfo ? 
                <UserInfo 
                    key={userInfo.result.userId} 
                    id={userInfo.result.userId} 
                    nick={userInfo.result.nickname}
                >
                </UserInfo> 
                : <Login></Login>} 
        </div>
    </div>
}