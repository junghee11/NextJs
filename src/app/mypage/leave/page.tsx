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
            <div className={styles.profileSection}>
                <div className={styles.icon} style={{fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
                <h2>회원 탈퇴</h2>
                <p className={styles.subtitle}>정말로 탈퇴하시겠습니까?</p>
                
                <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '16px',
                    margin: '24px 0',
                    color: '#dc2626'
                }}>
                    <strong>주의사항:</strong>
                    <ul style={{margin: '8px 0', paddingLeft: '20px'}}>
                        <li>탈퇴하신 계정으로 재가입이 불가능합니다</li>
                        <li>작성한 게시글과 댓글은 삭제되지 않습니다</li>
                        <li>구매 이력 및 포인트가 모두 삭제됩니다</li>
                    </ul>
                </div>
                
                <button onClick={clickLeaveSiteButton} className={styles.dangerButton}>
                    탈퇴하기
                </button>
            </div>
        </div>
    </div>
}