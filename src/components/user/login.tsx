import Link from "next/link";
import styles from "../../styles/user/login.module.css"

export default function Login() {
    return <div className={styles.container}>
        <form action="post" name="login">
            <div>
                <input type="text" placeholder="아이디를 입력해주세요" />
            </div>
            <div>
                <input type="text" placeholder="비밀번호를 입력해주세요" />
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