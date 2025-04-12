import Link from "next/link"
import styles from "../../../styles/user/sign-up.module.css"
import FindUserPassword from "../../../components/user/findUserPassword"

export default function FindPassword(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>비밀번호 찾기</h1>
        <FindUserPassword></FindUserPassword>
        <p style={{marginTop : '10px', fontSize : '15px'}}>아이디가 기억나지 않으세요? <Link href="/user/id" style={{border : 'none', color : 'rgb(107 104 222)'}}>아이디 찾기</Link></p>
    </div>
}