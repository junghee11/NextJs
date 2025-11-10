'use client';

import React, { createContext, useContext } from 'react';
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

    return (
        <StompContext.Provider value={stompValue}>{children}</StompContext.Provider>
    );
}
