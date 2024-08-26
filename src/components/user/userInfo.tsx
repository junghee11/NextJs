import {deleteCookie, getCookie} from "cookies-next";
import styles from "../../styles/user/login.module.css"

export default function UserInfo(props) {
    async function clickLoOutButton (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.reload();
    }

    return <div className={styles.container}>
            <div key={props.id}>{props.nick}님 안녕하세요!</div>
            <div><span onClick={clickLoOutButton}>로그아웃</span></div>
    </div>;
}