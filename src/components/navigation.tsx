"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../styles/navigation.module.css";

export default function Navagation() {
    const path = usePathname();
    const [count, setCount] = useState(0);
    console.log(path);
    return (
        <nav className={styles.nav}>
            <ul>
                <li>
                    <Link href="/">Home</Link>{path === "/" ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/schedule/all">경기일정</Link>{path.includes("/schedule/")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/team/all">팀정보</Link>{path.includes("/team/")  ? "⚾" : ""}
                </li>
            </ul>
        </nav>
    );
}