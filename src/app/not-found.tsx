"use client"

import Link from "next/link"
import styles from "../styles/error.module.css"

export default function ErrorOMG() {
    return <div style={{ textAlign: 'center', marginTop: '180px' }}>
    <h1>외부로 이탈하셨습니다. 구장으로 다시 돌아가시겠습니까?</h1>
    <Link className={styles.button} href='/'>
        <div>홈으로<br />돌아가기</div>
    </Link>
</div>
}