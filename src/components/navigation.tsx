"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../styles/navigation.module.css";

export default function Navagation() {
    const path = usePathname();
    return (
        <nav className={styles.nav}>
            <ul>
                <li>
                    <Link href="/">Home</Link>{path === "/" ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/schedule/all">경기일정</Link>{path.includes("/schedule")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/team/all">팀정보</Link>{path.includes("/team")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/stadium/all">경기장</Link>{path.includes("/stadium")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/player/all">선수정보</Link>{path.includes("/player")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/goods/all">굿즈</Link>{path.includes("/goods")  ? "⚾" : ""}
                </li>
                <li>
                    <Link href="/baseball/community">커뮤니티</Link>{path.includes("/community")  ? "⚾" : ""}
                </li>
            </ul>
        </nav>
    );
}