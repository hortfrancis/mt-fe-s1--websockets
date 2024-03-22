import { useEffect, useRef } from 'react';

export default function useAudioWebSocket(url, onMessage) {
    const socketConnection = useRef(null);

    useEffect(() => {
        socketConnection.current = new WebSocket(url);

        socketConnection.current.onopen = () => {
            console.log("Audio socket connection opened.");
        }

        socketConnection.current.onmessage = (event) => {
            if (typeof onMessage !== 'function') {
                console.error("onMessage is not a function");
                return;
            }
            onMessage(event.data);
        }

        socketConnection.current.onerror = (error) => {
            console.error("Audio socket connection error:", error);
        }

        socketConnection.current.onclose = () => {
            console.log("Audio socket connection closed.");
        }

        return () => {
            if (socketConnection.current)
                socketConnection.current.close();
        }
    }, [url, onMessage]);

    function sendAudio(audioChunks) {
        if (socketConnection.current && socketConnection.current.readyState === WebSocket.OPEN) {
            audioChunks.forEach((chunk) => {
                socketConnection.current.send(chunk);
            });
        } else {
            console.error("Audio socket connection is not open.");
        }
    }

    return sendAudio;
}