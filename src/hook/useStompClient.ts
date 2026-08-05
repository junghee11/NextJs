import { useCallback, useEffect, useRef, useState } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface RegistryEntry {
    destination: string;
    callback: (message: IMessage) => void;
    stompSub: StompSubscription | null;
}

export interface SubscriptionHandle {
    unsubscribe: () => void;
}

export type StompErrorListener = (message: string) => void;

export const useStompClient = (brokerURL?: string) => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const registryRef = useRef<Map<number, RegistryEntry>>(new Map());
    const subIdCounter = useRef(0);
    const firstConnectCallbackRef = useRef<(() => void) | null>(null);
    const errorListenersRef = useRef<Set<StompErrorListener>>(new Set());

    const notifyError = useCallback((message: string) => {
        errorListenersRef.current.forEach(listener => listener(message));
    }, []);

    const onError = useCallback((listener: StompErrorListener) => {
        errorListenersRef.current.add(listener);
        return () => {
            errorListenersRef.current.delete(listener);
        };
    }, []);

    const safeCallback = (entry: RegistryEntry) => (message: IMessage) => {
        try {
            entry.callback(message);
        } catch (error) {
            console.error('Error in subscription callback:', error);
        }
    };

    const connect = useCallback((headers: { [key: string]: string }, onFirstConnect?: () => void) => {
        if (clientRef.current?.active) return;
        if (!brokerURL) {
            console.error('WebSocket broker URL is not configured.');
            return;
        }

        firstConnectCallbackRef.current = onFirstConnect ?? null;

        const client = new Client({
            connectHeaders: headers,
            webSocketFactory: () => new SockJS(brokerURL),
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);

                // 재연결 시 기존 구독 복구 (핸들 갱신, 중복 없음)
                registryRef.current.forEach(entry => {
                    entry.stompSub = client.subscribe(entry.destination, safeCallback(entry));
                });

                // 최초 연결 1회만 콜백 실행 (재연결 시 창 자동 오픈 방지)
                if (firstConnectCallbackRef.current) {
                    firstConnectCallbackRef.current();
                    firstConnectCallbackRef.current = null;
                }
            },
            onDisconnect: () => {
                setIsConnected(false);
                registryRef.current.forEach(entry => { entry.stompSub = null; });
            },
            onStompError: (frame) => {
                notifyError(frame.headers['message'] || '채팅 서버 오류가 발생했습니다.');
                client.deactivate();
                setIsConnected(false);
            },
            onWebSocketClose: () => {
                setIsConnected(false);
                registryRef.current.forEach(entry => { entry.stompSub = null; });
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
            },
        });

        client.activate();
        clientRef.current = client;
    }, [brokerURL, notifyError]);

    const subscribe = useCallback((destination: string, callback: (message: IMessage) => void): SubscriptionHandle => {
        const id = subIdCounter.current++;
        const entry: RegistryEntry = { destination, callback, stompSub: null };
        registryRef.current.set(id, entry);

        if (clientRef.current?.connected) {
            entry.stompSub = clientRef.current.subscribe(destination, safeCallback(entry));
        }

        return {
            unsubscribe: () => {
                const target = registryRef.current.get(id);
                registryRef.current.delete(id);
                try {
                    target?.stompSub?.unsubscribe();
                } catch (error) {
                    console.error('Unsubscribe failed:', error);
                }
            },
        };
    }, []);

    const publish = useCallback((destination: string, body: unknown) => {
        if (clientRef.current?.connected) {
            clientRef.current.publish({ destination, body: JSON.stringify(body) });
        } else {
            notifyError('채팅 서버에 연결되어 있지 않습니다.');
        }
    }, [notifyError]);

    const disconnect = useCallback(() => {
        registryRef.current.clear();
        if (clientRef.current?.active) {
            clientRef.current.deactivate();
        }
        clientRef.current = null;
        setIsConnected(false);
    }, []);

    useEffect(() => {
        return () => {
            if (clientRef.current?.active) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    return { connect, subscribe, publish, disconnect, isConnected, onError };
};
