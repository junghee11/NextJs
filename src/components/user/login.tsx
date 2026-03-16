"use client"

import Link from "next/link";
import styles from "../../styles/user/login.module.css"
import { userLogin } from "../../service/user/apis";
import { useState } from "react";

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    async function handleLogin (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (userId == null || userId == "") {
            alert("아이디를 입력해주세요")
            return;
        } else if (password == null || password == "") {
            alert("비밀번호를 입력해주세요")
            return;
        }

        try {
            userLogin(userId, password);
        } catch (error) {
            console.error('로그인 실패:', error);
        }
    }

    return <div className={styles.container}>
        <form name="login" onSubmit={handleLogin}>
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
                <button type="submit">
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