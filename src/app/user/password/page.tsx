import Link from "next/link"
import styles from "../../../styles/user/login.module.css"

export default function FindId(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>비밀번호 찾기</h1>
        <br />
        <form action="post" name="login">
            <div>
                <input type="text" placeholder="아이디를 입력해주세요" />
            </div>
            <div style={{margin : '20px'}}>
                <button type="submit">
                    비밀번호 찾기
                </button>
            </div>
            <p style={{fontSize : '15px'}}>아이디가 기억나지 않으세요? <Link href="/user/id" style={{border : 'none', color : 'rgb(107 104 222)'}}>아이디 찾기</Link></p>
        </form>
    </div>
}