import { cookies } from "next/headers";

import styles from "../../../styles/mypage/mypage.module.css"
import { getUserInfo } from "../../../service/user/apis";
import Category from "../../../components/mypage/category";
import ResetPassword from "../../../components/user/resetPassword";

export default async function MyPage() {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    const userInfo = await getUserInfo(access_token);

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <img src={"/images/" + userInfo.result.profile_img_url} alt="profile"/>
            <p>팀을 응원해주세요 ❤</p>
            <p>닉네임 : {userInfo.result.nickname}</p>
            <p>아이디 : {userInfo.result.userId}</p>
            <p>전화번호 : {userInfo.result.phone}</p>
            <p>등급 : {userInfo.result.grade}</p>
            <ResetPassword accessToken={access_token}></ResetPassword>
        </div>
    </div>
}