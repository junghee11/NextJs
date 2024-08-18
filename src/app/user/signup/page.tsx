import styles from "../../../styles/user/login.module.css"

export default function FindId(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>회원가입</h1>
        <form action="post" name="login">
            <div style={{margin : '20px'}}>
                <input style={{width : '105px'}} type="text" placeholder="아이디" />
                <button style={{width : '54px', marginLeft: '10px'}}>확인</button>
            </div>
            <div>
                <input type="text" placeholder="비밀번호" />
            </div>
            <div style={{margin : '20px'}}>
                <input type="text" placeholder="이메일" />
            </div>
            <div>
                <input type="text" placeholder="생년월일 8자리" />
            </div>
            <div style={{margin : '20px'}}>
                <input type="text" placeholder="휴대전화번호" />
            </div>
            <div>
                <button type="submit">
                    회원가입
                </button>
            </div>
        </form>
    </div>
}