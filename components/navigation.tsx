"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navagation() {
    const path = usePathname();
    const [count, setCount] = useState(0);
    console.log(path);
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Home</Link>{path === "/" ? "🧁" : ""}
                </li>
                <li>
                    <Link href="/about-us">AboutUs</Link>{path === "/about-us" ? "🧁" : ""}
                </li>
                <li><button onClick={() => setCount(c => c+1)}>{count}</button></li>
            </ul>
        </nav>
    );
}