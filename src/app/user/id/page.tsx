import styles from "../../../styles/user/login.module.css"

export default function FindId(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>아이디 찾기</h1>
        <p style={{fontSize:'15px', margin : '10px 0', lineHeight: '30px'}}>
            ※ 회원정보에 등록하신 휴대 전화번호와 <br/> 입력하신 휴대전화 번호가 같아야 정보조회가 가능합니다
        </p>
        <br />
        <form action="post" name="login">
            <div>
                <input type="text" placeholder="이름을 입력해주세요" />
            </div>
            <div style={{margin : '20px'}}>
                <input type="text" placeholder="휴대전화를 입력해주세요" />
            </div>
            <div>
                <button type="submit">
                    아이디 찾기
                </button>
            </div>
        </form>
    </div>
}