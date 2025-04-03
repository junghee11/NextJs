import styles from "../../../styles/user/sign-up.module.css"
import UserSignUp from "../../../components/user/signUp";

export default function SignUp(){
    return <div style={{textAlign:'center'}} className={styles.container}>
        <h1 style={{fontSize:'25px', fontWeight:'bold'}}>회원가입</h1>
        <UserSignUp></UserSignUp>
    </div>
}