import { IMessage } from "@stomp/stompjs";

export interface IStompContext {
    connect: (headers: { [key: string]: any }, onConnectCallback?: () => void) => void;
    subscribe: (destination: string, callback: (message: IMessage) => void) => any;
    publish: (destination: string, body: any, headers?: { [key: string]: any }) => void;
    disconnect: () => void;
    isConnected: boolean;
    client: React.MutableRefObject<Client | null>;
}
