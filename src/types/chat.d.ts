import { IMessage } from "@stomp/stompjs";
import { SubscriptionHandle, StompErrorListener } from "../hook/useStompClient";

export interface IStompContext {
    connect: (headers: { [key: string]: string }, onFirstConnect?: () => void) => void;
    subscribe: (destination: string, callback: (message: IMessage) => void) => SubscriptionHandle;
    publish: (destination: string, body: unknown) => void;
    disconnect: () => void;
    isConnected: boolean;
    onError: (listener: StompErrorListener) => () => void;
}
