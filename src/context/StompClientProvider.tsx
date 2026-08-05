'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { getCookie } from 'cookies-next';
import { useStompClient } from '../hook/useStompClient';
import { IStompContext } from '../types/chat';

const StompContext = createContext<IStompContext | null>(null);

export function useStomp() {
    const context = useContext(StompContext);
    if (!context) {
        throw new Error('useStomp must be used within a StompClientProvider');
    }
    return context;
}

export function StompClientProvider({ children }: { children: React.ReactNode }) {
    const brokerURL = process.env.NEXT_PUBLIC_WEBSOCKET_BROKER_URL;
    const stompValue = useStompClient(brokerURL);
    const { connect } = stompValue;

    // 로그인 상태면 페이지 로드 시 자동 연결
    useEffect(() => {
        const token = getCookie('access_token');
        if (token) {
            connect({ Authorization: `Bearer ${token}` });
        }
    }, [connect]);

    return (
        <StompContext.Provider value={stompValue}>{children}</StompContext.Provider>
    );
}
