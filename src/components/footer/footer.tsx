import styles from "./footer.module.css";

export default function Footer() {
    return (
        <div className={styles.container}>
            <div>
                {/* <div><img src="img/logo.png" alt=""></div> */}
                <div>
                    <p className={styles.p}>BASEBALL HUB</p>
                    <p><span>COPYRIGHT ⓒ JUNGHEE. All Rights reserved</span></p>
                </div>
            </div>
        </div>
    );
}