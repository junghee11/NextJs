"use client"

import {usePathname} from "next/navigation";

export default function getPath(){
    const path = usePathname();
    return path;
}