import Link from "next/link";
import styles from "../../styles/popup/popup.module.css"

interface MessagePopupProps {
    message: string;
    pathname: string;
}

export default function messagePopup({message, pathname} : MessagePopupProps) {  
    return (
        <div className={styles.popupOverlay}>
            <div className={styles.popup}>
                <h2>{message}</h2>
                <div>
                    <Link href={pathname}>확인</Link>
                </div>
            </div>
        </div>
    );
} 