"use client"

import styles from "../../styles/user/sign-up.module.css"
import { sendSmsUserPhone, checkUserPhone, findUserPw } from "../../service/user/apis";
import { useState } from "react";

export default function findUserPassword() {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setverificationCode] = useState('');

    const [phoneDisabled, setPhoneDisabled] = useState(false);
    const [codeDisabled, setCodeDisabled] = useState(false);

    async function clickSendSmsButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (userId == null || userId == "") {
            alert("아이디를 입력해주세요")
            return;
        } else if (phone == null || phone == "") {
            alert("휴대폰 번호를 입력해주세요")
            return;
        }

        try { 
            const response = sendSmsUserPhone(phone, userId, "FIND_PW").then(result => {
                if(result) {
                    setPhoneDisabled(true);
                }
            });
        } catch (error) {
            console.error('문자발송 실패 :', error);
        }
    }

    async function clickVerificationPhoneButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (!phoneDisabled) {
            alert("휴대폰번호 인증 요청을 먼저 해주세요")
            return;
        } else if (verificationCode == null || verificationCode == "") {
            alert("인증번호를 입력해주세요")
            return;
        } 

        try { 
            const response = checkUserPhone(phone, name, verificationCode, "FIND_ID").then(result => {
                if(result) {
                    setCodeDisabled(true);
                }
            });
        } catch (error) {
            console.error('본인인증 실패 :', error);
        }
    }

    async function clickFindIdButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (!phoneDisabled) {
            alert("휴대폰번호 인증 요청을 먼저 해주세요")
            return;
        } else if (!codeDisabled) {
            alert("휴대폰 인증이 완료되지 않았습니다")
            return;
        } 

        try { 
            const response = findUserPw(userId, name, phone)
        } catch (error) {
            console.error('본인인증 실패 :', error);
        }
    }

    return <form action="post" name="findPassword">
        <div style={{margin : '20px'}}>
                    <input type="text" 
                            placeholder="아이디" 
                            value={userId} 
                            name="userId"
                            disabled={phoneDisabled}
                            style={{
                                backgroundColor: phoneDisabled ? "#ccc" : "#000000", 
                                color: phoneDisabled ? "#666" : "#fff", 
                            }}
                            onChange={(event) => setUserId(event.target.value)}/>
                </div>
                <div style={{margin : '20px'}}>
                    <input type="text" 
                            placeholder="성함" 
                            value={name} 
                            name="name"
                            disabled={phoneDisabled}
                            style={{
                                backgroundColor: phoneDisabled ? "#ccc" : "#000000", 
                                color: phoneDisabled ? "#666" : "#fff", 
                            }}
                            onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className={styles.checkInfo}>
                    <input type="text" 
                           placeholder="휴대폰 번호('-'제외)" 
                           value={phone} 
                           name="phone"
                           disabled={phoneDisabled}
                           style={{
                                backgroundColor: phoneDisabled ? "#ccc" : "#000000", 
                                color: phoneDisabled ? "#666" : "#fff", 
                            }}
                           onChange={(event) => setPhone(event.target.value)}/>
                    <button 
                        onClick={clickSendSmsButton}
                        disabled={phoneDisabled}
                        style={{
                            backgroundColor: phoneDisabled ? "#ccc" : "rgb(107 104 222)",
                            color: phoneDisabled ? "#666" : "#fff", 
                            cursor: phoneDisabled ? "not-allowed" : "pointer", 
                        }}
                    >
                            
                        인증
                    </button>
                </div>
                <div className={styles.checkInfo}>
                    <input type="text" 
                           placeholder="인증번호(6자리)" 
                           value={verificationCode} 
                           name="verificationCode"
                           disabled={codeDisabled}
                           style={{
                                backgroundColor: codeDisabled ? "#ccc" : "#000000", 
                                color: codeDisabled ? "#666" : "#fff", 
                            }}
                           onChange={(event) => setverificationCode(event.target.value)}/>
                    <button 
                        onClick={clickVerificationPhoneButton}
                        disabled={codeDisabled}
                        style={{
                            backgroundColor: codeDisabled ? "#ccc" : "rgb(107 104 222)",
                            color: codeDisabled ? "#666" : "#fff", 
                            cursor: codeDisabled ? "not-allowed" : "pointer", 
                        }}
                    >
                            
                        확인
                    </button>
                    <p style={{color : "#ca4a4a", fontSize : "11px", margin : "5px"}}>※ 인증번호는 요청 후 5분 이내에 입력하셔야 합니다</p>
                </div>
                <div>
                    <button type="button" className={styles.lastButton} onClick={clickFindIdButton}>
                        비밀번호 찾기
                    </button>
                </div>
            </form>;
}