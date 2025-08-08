"use client"

import Link from "next/link";
import styles from "../../styles/mypage/mypage.module.css"
import { usePathname } from "next/navigation";

export default function mypageCategory() {
    const path = usePathname();
    return (
        <div className = {styles.category}>
            <div>
                <div className = {styles.title}>MY 팀</div>
                <div className={path === "/mypage/baseball/team" ? styles.active : ''}><Link href="/mypage/baseball/team">내가 응원하는 팀</Link></div>
                <div className={path === "/mypage/baseball/stadium" ? styles.active : ''}><Link href="/mypage/baseball/stadium">자주가는 경기장</Link></div>
                <div className={path === "/mypage/baseball/player" ? styles.active : ''}><Link href="/mypage/baseball/player">내가 응원하는 선수</Link></div>
            </div>
            <div>
                <div className = {styles.title}>MY 쇼핑</div>
                <div className={path === "/mypage/shop/cart" ? styles.active : ''}><Link href="/mypage/goods/cart">장바구니</Link></div>
                <div className={path === "/mypage/shop/like" ? styles.active : ''}><Link href="/mypage/goods/like">찜 목록</Link></div>
                <div className={path === "/mypage/shop/purchase" ? styles.active : ''}><Link href="/mypage/goods/purchase">구매내역</Link></div>
            </div>
            <div>
                <div className = {styles.title}>MY 커뮤니티</div>
                <div className={path === "/mypage/community/article" ? styles.active : ''}><Link href="/mypage/community/article">내가 작성한 게시글</Link></div>
                <div className={path === "/mypage/community/comment" ? styles.active : ''}><Link href="/mypage/community/comment">내가 작성한 댓글</Link></div>
            </div>
            <div>
                <div className = {styles.title}>회원정보 관리</div>
                <div className={path === "/mypage/info" ? styles.active : ''}><Link href="/mypage/info">회원정보 변경</Link></div>
                <div className={path === "/mypage/leave" ? styles.active : ''}><Link href="/mypage/leave">회원 탈퇴</Link></div>
            </div>
        </div>
    );
}