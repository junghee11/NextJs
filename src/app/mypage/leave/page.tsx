'use client'

import styles from "../../../styles/mypage/mypage.module.css"
import { leaveSite } from "../../../service/mypage/apis";
import Category from "../../../components/mypage/category";
import {deleteCookie} from "cookies-next";

export default function LeaveSite() {
    const clickLeaveSiteButton = async () => {
        event.preventDefault();
        try {
            const response = await leaveSite();

            alert(response.message);

            deleteCookie("access_token");
            deleteCookie("refresh_token");
            window.location.href = "/";
        } catch (error) {
            alert("오류가 발생했습니다");
        }
    }

    return <div className = {styles.container}>
        <Category></Category>
        <div className = {styles.content}>
            <button onClick={clickLeaveSiteButton}><a href="">탈퇴하기</a></button>
        </div>
    </div>
}