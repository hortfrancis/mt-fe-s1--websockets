import { useEffect, useRef } from 'react';

export default function useTextWebSocket(url, onMessage) {
    const socketConnection = useRef(null);

    useEffect(() => {
        socketConnection.current = new WebSocket(url);

        socketConnection.current.onopen = () => {
            console.log("Text socket connection opened.");
        }

        socketConnection.current.onmessage = (event) => {
            if (typeof onMessage !== 'function') {
                console.error("onMessage is not a function");
                return;
            }
            onMessage(JSON.parse(event.data));
        }

        socketConnection.current.onerror = (error) => {
            console.error("Text socket connection error:", error);
        }

        socketConnection.current.onclose = () => {
            console.log("Text socket connection closed.");
        }

        return () => {
            if (socketConnection.current)
                socketConnection.current.close();
        }
    }, [url, onMessage]);

    function sendMessage(message) {
        if (socketConnection.current && socketConnection.current.readyState === WebSocket.OPEN) {
            socketConnection.current.send(JSON.stringify(message));
        } else {
            console.error("Text socket connection is not open.");
        }
    }

    return sendMessage;
}
