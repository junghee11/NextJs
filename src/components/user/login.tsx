"use client"

import Link from "next/link";
import styles from "../../styles/user/login.module.css"
import { userLogin } from "../../service/user/apis";
import { useState } from "react";

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    async function clickLoginButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try { 
            const response = userLogin(userId, password);
            // window.location.reload();
            console.log('로그인 성공:', response);
        } catch (error) {
            console.error('로그인 실패:', error);
        }
    }

    return <div className={styles.container}>
        <form name="login">
            <div>
                <input 
                    type="text" 
                    placeholder="아이디를 입력해주세요" 
                    value={userId} 
                    name="userId"
                    onChange={(event) => setUserId(event.target.value)}
                />
            </div>
            <div>
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력해주세요" 
                    value={password} 
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div>
                <button type="button" onClick={clickLoginButton}>
                    로그인
                </button>
            </div>
            <div>
                <Link href="/user/password">비밀번호 찾기</Link>
                <Link href="/user/id">아이디 찾기</Link>
                <Link href="/user/signup">회원가입</Link>
            </div>
        </form>
    </div>;
}