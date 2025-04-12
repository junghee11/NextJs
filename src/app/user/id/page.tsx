import styles from "../../../styles/user/sign-up.module.css"
import FindUserId from "../../../components/user/findUserId"

export default function FindId(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>아이디 찾기</h1>
        <p style={{fontSize:'15px', margin : '10px 0 0', lineHeight: '30px'}}>
            회원정보에 등록하신 휴대 전화번호와 <br/> 같은 휴대전화 번호가 아닐 경우 정보조회가 불가합니다
        </p>
        <FindUserId></FindUserId>
    </div>
}