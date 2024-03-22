import { useState, useEffect, useRef } from "react";
import useTextWebSocket from "./hooks/useTextWebSocket";
import useAudioWebSocket from "./hooks/useAudioWebSocket";
import { AudioInput, Message } from "./components";

export default function App() {

    const [conversation, setConversation] = useState([]);
    const socketConnection = useRef(null);
    // const expectBinary = useRef(false);

    // For prototyping purposes
    // const [audioUrl, setAudioUrl] = useState(null);

    // function addMessageToConversation(messageObject) {
    //     setConversation((prev) => [...prev, messageObject]);
    // }

    useEffect(() => {
        console.log('Text WebSocket URL', import.meta.env.VITE_BACKEND_TEXT_WS_URL);
        console.log('Audio WebSocket URL', import.meta.env.VITE_BACKEND_AUDIO_WS_URL);

        sendTextMessage({ message: "Hello from the frontend!" });
    }, []);

    const sendTextMessage = useTextWebSocket(
        import.meta.env.VITE_BACKEND_TEXT_WS_URL,
        (reply) => {
            console.log("Reply from server:", reply);
        }
    );

    function testTextSocketConnection() {
        sendTextMessage({ message: "Testing WebSocket connection: hello from the frontend!" });
    }

    const streamAudio = useAudioWebSocket(import.meta.env.VITE_BACKEND_AUDIO_WS_URL, (message) => {
        console.log("Received message:", message);
        // Handle any messages from the server here
    });



    // NEW!
    // useEffect(() => {


    //     sendTextMessage({ message: "Hello from the frontend!" });

    // socketConnection.current.onopen = () => {
    //     console.log("WebSocket connection opened.");
    // }

    // socketConnection.current.onmessage = (event) => {

    //     // console.log('event.data', event.data);

    //     // if (expectBinary.current === false &&
    //     //     JSON.parse(event.data).mode === 'audio') {
    //     //     console.log('Switching to receive-audio mode');
    //     //     expectBinary.current = true;
    //     //     return;
    //     // }

    //     // if (expectBinary.current) {
    //     //     console.log('expecting binary data');

    //     //     // Fleshing this out in the next commit 

    //     //     // console.log('expecting binary data');
    //     //     // Handle binary data
    //     //     const audioBlob = new Blob([event.data], { type: "audio/mpeg" });
    //     //     const audioUrl = URL.createObjectURL(audioBlob);
    //     //     setAudioUrl(audioUrl);
    //     //     // expectBinary.current = false;
    //     //     return;
    //     // } else {
    //     //     // Handle text data as JSON
    //     //     console.log("expecting text data");
    //     //     try {
    //     //         console.log("Received text data:", JSON.parse(event.data));
    //     //         // Add the returned data to the conversation array 
    //     //         if (JSON.parse(event.data).mode !== 'audio') console.log('we think its audio data');

    //     //     } catch (error) {
    //     //         console.error("Error parsing JSON data:", error);
    //     //     }
    // }


    //     console.log("Received message from server via socket connection:", event.data);
    //     // More response handling probably here... 
    // }

    // socketConnection.current.onerror = (error) => {
    //     console.error("WebSocket connection error:", error);
    // }

    // socketConnection.current.onclose = () => {
    //     console.log("WebSocket connection closed.");
    // }

    // return () => {
    //     // Close the WebSocket connection when the component unmounts
    //     if (socketConnection.current) {
    //         socketConnection.current.close();
    //     }
    // }
    // }, []);

    // function testWebSocketConnection() {
    //     if (socketConnection.current) {
    //         socketConnection.current.send(JSON.stringify({ message: "Testing WebSocket connection..." }));
    //     }
    // }

    // OLD! 
    // useEffect(() => {
    //     console.log(import.meta.env.VITE_BACKEND_URL);
    //     // Make a generic request to the backend to wake up the server
    //     (async () => {
    //         try {
    //             const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/');
    //             if (response.status === 200) console.log("Server is available!");
    //         } catch (error) {
    //             console.error("Error checking server availability:", error);
    //         }
    //     })();
    // }, []);

    // function base64ToBlob(base64, type) {
    //     const binaryString = window.atob(base64);
    //     const len = binaryString.length;
    //     const bytes = new Uint8Array(len);
    //     for (let i = 0; i < len; i++) {
    //         bytes[i] = binaryString.charCodeAt(i);
    //     }
    //     return new Blob([bytes], { type });
    // }

    // NEW!
    // async function sendAudioToServer(audioChunks) {
    //     const audioBlob = new Blob(audioChunks, { type: "audio/flac" });
    //     const arrayBuffer = await audioBlob.arrayBuffer();

    //     if (socketConnection.current && socketConnection.current.readyState === WebSocket.OPEN) {
    //         console.log("Sending audio to server via WebSocket...");
    //         // Switch to audio mode then send the binary audio data
    //         socketConnection.current.send(JSON.stringify({ mode: "audio" }));
    //         socketConnection.current.send(arrayBuffer);
    //     } else {
    //         console.error("WebSocket connection not open.");
    //     }
    // }

    // OLD!
    // async function sendAudioToServer(audioChunks) {
    //     // Prepare the audio data to send to the server
    //     const audioBlob = new Blob(audioChunks, { type: "audio/flac" });  // Could change this, but it works so far 
    //     const formData = new FormData();
    //     formData.append("audio", audioBlob);

    //     try {
    //         console.log("Sending audio to server...");
    //         const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/receive', {
    //             method: "POST",
    //             body: formData,
    //         });
    //         const data = await response.json();

    //         console.log("data:", data);

    //         // Add the returned data to the conversation array 
    //         const userMessage = {
    //             role: "user",
    //             messages: {
    //                 user_message_english: data.modelTranscription.user_message_english
    //             },
    //             audio: URL.createObjectURL(base64ToBlob(data.userAudio, 'audio/mpeg'))
    //         };

    //         const modelMessage = {
    //             role: "assistant",
    //             messages: {
    //                 gpt_response_english: data.modelTranscription.gpt_response_english,
    //                 gpt_response: data.modelTranscription.gpt_response,
    //                 gpt_response_breakdown: data.modelTranscription.gpt_response_breakdown,
    //                 suggestions: data.modelTranscription.suggestions
    //             },
    //             audio: URL.createObjectURL(base64ToBlob(data.modelAudio, 'audio/mpeg'))
    //         };

    //         addMessageToConversation(userMessage);
    //         addMessageToConversation(modelMessage);

    //     } catch (error) {
    //         console.error("Error sending audio to server:", error);
    //     }
    // }

    return (
        <main className="m-10 flex flex-col items-center gap-10">

            <button onClick={testTextSocketConnection} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Test <span className="font-bold text-blue-900 uppercase bg-slate-50 rounded mx-2 p-1"> text </span>
                socket connection
            </button>

            {/* {audioUrl && <audio src={audioUrl} autoPlay controls></audio>} */}

            {conversation
                .filter((item) => item.role !== "system") // Exclude 'system' messages
                .map((item, index) => (
                    <Message key={index} data={item} />
                ))}

            <AudioInput streamAudio={streamAudio} />
        </main>
    );
}
