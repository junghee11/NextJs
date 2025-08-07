"use client"

import { ReactNode } from "react";
import Cookies from "js-cookie";

interface LoginRequiredButtonProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    message?: string; 
}

export default function LoginRequiredButton({ 
    children, 
    className, 
    style, 
    onClick, 
    disabled = false,
    type = "button",
    message = "로그인 후 이용해주세요."
}: LoginRequiredButtonProps) {
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const accessToken = Cookies.get('access_token');
        
        if (!accessToken) {
            alert(message);
            return;
        }
        
        if (onClick) {
            onClick();
        }
    };

    return (
        <button
            type={type}
            className={className}
            style={style}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
} 