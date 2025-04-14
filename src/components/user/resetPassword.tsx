"use client"

import styles from "../../styles/user/sign-up.module.css"
import { resetUserPw } from "../../service/user/apis";
import { useState } from "react";

export default function resetPassword({accessToken}) {
    const [originalPw, setOriginalPw] = useState('');
    const [newPw, setNewPw] = useState('');

    async function clickResetPwButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,20}$/;

        if (originalPw == null || originalPw == "") {
            alert("기존 비밀번호를 입력해주세요")
            return;
        } else if (newPw == null || newPw == "") {
            alert("신규 비밀번호를 입력해주세요")
            return;
        } else if (newPw.length < 8 || newPw.length > 20) {
            alert("비밀번호는 8~20자 사이여야 합니다");
            return;
        } else if (!regex.test(newPw)) {
            alert("비밀번호는 영문, 숫자, 특수문자 조합(공백제외) 8 ~ 20자로 설정해주세요");
            return;
        } else if (originalPw == newPw) {
            alert("새 비밀번호는 기존과 다르게 설정해주세요");
            return;
        } 

        try { 
            const response = resetUserPw(accessToken, originalPw, newPw);
        } catch (error) {
            console.error('문자발송 실패 :', error);
        }
    }
    
    return <div className = {styles.container}>
        <form action="post" name="findPassword">
                <div style={{margin : '20px 0'}}>
                    <input type="password"  
                            placeholder="기존 비밀번호" 
                            value={originalPw} 
                            name="originalPw"
                            onChange={(event) => setOriginalPw(event.target.value)}/>
                </div>
                <div style={{margin : '20px 0'}}>
                    <input type="password"  
                           placeholder="새 비밀번호" 
                           value={newPw} 
                           name="newPw"
                           onChange={(event) => setNewPw(event.target.value)}/>
                </div>
                <div>
                    <button type="button" className={styles.lastButton} onClick={clickResetPwButton}>
                        비밀번호 변경
                    </button>
                </div>
            </form>
    </div>;
}