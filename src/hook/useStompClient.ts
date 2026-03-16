import { useEffect, useRef, useState } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Subscription {
    destination: string;
    callback: (message: IMessage) => void;
}

export const useStompClient = (brokerURL: string) => {
    const clientRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const subscriptionsRef = useRef<Subscription[]>([]);

    useEffect(() => {
        return () => {
            if (clientRef.current && clientRef.current.active) {
                console.log('Disconnecting STOMP client...');
                clientRef.current.deactivate();
            }
        };
    }, []);

    const connect = (headers: { [key: string]: any }, onConnectCallback?: () => void) => {
        if (clientRef.current && clientRef.current.active) {
            console.log('Already connected.');
            return;
        }

        const client = new Client({
            brokerURL,
            connectHeaders: headers, 
            webSocketFactory: () => new SockJS(process.env.NEXT_PUBLIC_DEV_API_URL + '/ws'),
            debug: (str) => { 
                // console.log(new Date(), str); 
            }, 
            reconnectDelay: 5000, 
            onConnect: () => {
                setIsConnected(true);

                console.log('Connected to STOMP broker');
                
                subscriptionsRef.current.forEach(sub => {
                    client.subscribe(sub.destination, sub.callback);
                });

                if (onConnectCallback) {
                    onConnectCallback();
                }
            },
            onDisconnect: () => {
                console.log('Disconnected from STOMP broker');
                setIsConnected(false);
            },
            onStompError: (frame) => {
                alert(frame.headers['message']);
                client.deactivate();
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error: ' + event);
            },
            onWebSocketClose: (event) => {
                console.log('WebSocket closed: ' + event);
            }
        });

        client.activate();
        clientRef.current = client; 
    };

    const subscribe = (destination: string, callback: (message: IMessage) => void) => {
        const subscription = { destination, callback };
        subscriptionsRef.current.push(subscription);

        if (clientRef.current && clientRef.current.active) {
            return clientRef.current.subscribe(destination, (message) => {
                try {
                    callback(message);
                } catch (error) {
                    console.error('Error in subscription callback:', error);
                }
            })
        }
    };

    const publish = (destination: string, body: any) => {
        if (clientRef.current && clientRef.current.active) {
            clientRef.current.publish({ destination, body: JSON.stringify(body)});
        }
    };

    return { connect, subscribe, publish, isConnected };
};
