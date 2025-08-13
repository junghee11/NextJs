import Link from "next/link";
import styles from "../../styles/popup/popup.module.css"

export default function LoginPopup() {  
    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <h2>로그인 후 이용 가능합니다.</h2>
                <div>
                    <Link href="/">확인</Link>
                </div>
            </div>
        </div>
    );
} 