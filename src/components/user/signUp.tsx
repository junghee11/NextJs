"use client"

import styles from "../../styles/user/sign-up.module.css"
import { userSignUp, checkUserId, checkNickname, sendSmsUserPhone, checkUserPhone, getClientInfo } from "../../service/user/apis";
import { useState } from "react";

export default function signUp() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setverificationCode] = useState('');

    const [idDisabled, setIdDisabled] = useState(false);
    const [nicknameDisabled, setNicknameDisabled] = useState(false);
    const [phoneDisabled, setPhoneDisabled] = useState(false);
    const [codeDisabled, setCodeDisabled] = useState(false);

    async function clickCheckIdButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        const regex = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,10}$/;

        if (userId.length < 4 || userId.length > 10) {
            alert("아이디는 4~10자 사이여야 합니다.");
            return;
        } else if (!regex.test(userId)) {
            alert("아이디는 영문(필수), 숫자(선택) 조합(공백제외) 4 ~ 10자로 설정해주세요.");
            return;
        } 

        try { 
            const response = checkUserId(userId).then(result => {
                if(result) {
                    setIdDisabled(true);
                }
            });
        } catch (error) {
            console.error('아이디 중복확인 실패 :', error);
        }
    }

    async function clickCheckNicknameButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try { 
            const response = checkNickname(nickname).then(result => {
                if(result) {
                    setNicknameDisabled(true);
                }
            });
        } catch (error) {
            console.error('닉네임 중복확인 실패 :', error);
        }
    }

    async function clickSendSmsButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try { 
            const response = sendSmsUserPhone(phone, "SIGN_UP").then(result => {
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
        try { 
            const response = checkUserPhone(phone, verificationCode).then(result => {
                if(result) {
                    setCodeDisabled(true);
                }
            });
        } catch (error) {
            console.error('본인인증 실패 :', error);
        }
    }

    async function clickSignUpButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        try { 
            getClientInfo().then((result) => {
                const country = result.IPv4;
                const ip = result.country_name;
                const response = userSignUp
                    ({userId, password, name, nickname, phone, country, ip});
            });
        } catch (error) {
            console.error('회원가입 실패:', error);
        }
    }

    return <form action="post" name="signup">
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
                           placeholder="휴대폰 번호('-'를 제외)" 
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
                </div>
                <div className={styles.checkInfo}>
                    <input type="text" 
                           placeholder="아이디(4 ~ 10자)" 
                           value={userId} 
                           name="userId"
                           disabled={idDisabled}
                           style={{
                                backgroundColor: idDisabled ? "#ccc" : "#000000", 
                                color: idDisabled ? "#666" : "#fff", 
                            }}
                           onChange={(event) => setUserId(event.target.value)}/>
                    <button disabled={idDisabled}
                        style={{
                            backgroundColor: idDisabled ? "#ccc" : "rgb(107 104 222)",
                            color: idDisabled ? "#666" : "#fff", 
                            cursor: idDisabled ? "not-allowed" : "pointer", 
                        }}
                        onClick={clickCheckIdButton}>
                        확인
                    </button>
                </div>
                <div className={styles.checkInfo}>
                    <input type="text" 
                           placeholder="닉네임(2 ~ 10자)" 
                           value={nickname} 
                           name="nickname"
                           disabled={nicknameDisabled}
                           style={{
                                backgroundColor: nicknameDisabled ? "#ccc" : "#000000", 
                                color: nicknameDisabled ? "#666" : "#fff", 
                            }}
                           onChange={(event) => setNickname(event.target.value)}/>
                    <button 
                        onClick={clickCheckNicknameButton}
                        disabled={nicknameDisabled}
                        style={{
                            backgroundColor: nicknameDisabled ? "#ccc" : "rgb(107 104 222)",
                            color: nicknameDisabled ? "#666" : "#fff", 
                            cursor: nicknameDisabled ? "not-allowed" : "pointer", 
                        }}
                    >
                        확인
                    </button>
                </div>
                <div style={{margin : '20px'}}>
                    <input type="password" 
                            placeholder="비밀번호(8 ~ 20자)" 
                            value={password} 
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <div>
                    <button type="button" onClick={clickSignUpButton}>
                        회원가입
                    </button>
                </div>
            </form>;
}