"use client"

import Link from "next/link";
import styles from "../../styles/header/headerMenu.module.css";
import {deleteCookie} from "cookies-next";

export default function headerMenu({userInfo} : {userInfo : boolean}) {
    async function clickLoOutButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = "/";
    }
    
    return (
        <nav className={styles.nav}>
            {userInfo ? 
                <ul>
                    <li>
                        <Link href="/mypage/info">마이페이지</Link>
                    </li>
                    <li>
                        <Link href="/ask">고객센터</Link> 
                    </li>
                    <li>
                        <button onClick={clickLoOutButton}><a href="">로그아웃</a></button>
                    </li>
                </ul>                    
                :
                <ul>
                    <li>
                        <Link href="/">로그인</Link>
                    </li>
                    <li>
                        <Link href="/user/signup">회원가입</Link>
                    </li>
                    <li>
                        <Link href="/ask">고객센터</Link> 
                    </li>
                </ul>
            }
        </nav>
    );
}