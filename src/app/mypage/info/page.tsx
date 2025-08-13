import { cookies } from "next/headers";

import styles from "../../../styles/mypage/mypage.module.css"
import { getUserInfo } from "../../../service/user/apis";
import Category from "../../../components/mypage/category";
import ResetPassword from "../../../components/user/resetPassword";
import LoginRequiredButton from "../../../components/common/LoginRequiredButton";
import LoginPopup from "../../../components/common/LoginPopup";

export default async function MyPage() {
    const cookieStore = cookies();
    const access_token = cookieStore.get("access_token");
    
    const userInfo = await getUserInfo(access_token);
    if (userInfo == null) {
        return <LoginPopup></LoginPopup>
    }

    const imgUrl = userInfo.result.profile_img_url ? 
    userInfo.result.profileImgUrl : "tmp/profile/img_profile.png";

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <div className={styles.profileSection}>
                <img src={"/images/" + imgUrl} alt="profile"/>
                <h2>{userInfo.result.nickname}</h2>
                
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <strong>닉네임</strong>
                        <span>{userInfo.result.nickname}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>아이디</strong>
                        <span>{userInfo.result.userId}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>응원팀</strong>
                        <span>{userInfo.result.team == null ? "-" : userInfo.result.team}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>전화번호</strong>
                        <span>{userInfo.result.phone}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>잔여포인트</strong>
                        <span>{userInfo.result.point}</span>
                    </div>
                    <div className={styles.infoCard}>
                        <strong>회원등급</strong>
                        <span>{userInfo.result.grade}</span>
                    </div>
                </div>
            </div>
            <ResetPassword accessToken={access_token}></ResetPassword>
        </div>
    </div>
}