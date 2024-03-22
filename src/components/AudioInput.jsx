/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

export default function AudioInput({ streamAudio }) {
    const recording = useRef(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const streamRef = useRef(null); // Holds the stream object

    useEffect(() => {
        // Cleanup the stream when the component unmounts
        return () => {
            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Cleanup the stream and recorder when the component unmounts
    useEffect(() => {
        return () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
                console.log("Recording stopped due to unmount");
            }
        };
    }, [mediaRecorder]);

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream; // Store the stream for later cleanup
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                console.log('recording', recording.current); // Always false
                if (event.data.size > 0 && recording.current) {
                    streamAudio([event.data]);
                }
            };
            recorder.start(250); // Start recording, and generate audio chunks every 250ms
            setMediaRecorder(recorder);

            console.log("Recording started");
            recording.current = true;
        } catch (error) {
            console.error("Error accessing audio device:", error);
        }
    }

    function stopRecording() {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
            console.log("Recording stopped");
            recording.current = false;
        }
    }

    return (
        <div className="fixed bottom-12">
            <button
                className={`px-4 py-2 text-2xl font-semibold text-white transition-colors duration-200 rounded-lg shadow-[0_20px_50px_rgba(_255,_255,_255,_1)]
                    ${recording.current 
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } `}
                onClick={!recording.current ? startRecording : stopRecording}
            >
                {!recording.current ? "Speak" : "Stop"} {recording.current ? "⏳" : ""}
            </button>
        </div>
    );
}







// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";

// export default function AudioInput({ sendAudioToServer }) {
//     const [recording, setRecording] = useState(false);
//     const [processing, setProcessing] = useState(false);
//     const [audioChunks, setAudioChunks] = useState([]);  // The currently recording audio
//     const [mediaRecorder, setMediaRecorder] = useState(null);

//     useEffect(() => {
//         // Every time audioChunks changes, check if we should send the audio to the server
//         if (!recording && audioChunks.length > 0) {
//             (async () => {
//                 sendAudioToServer(audioChunks);
//                 setAudioChunks([]);
//             })();
//         }
//     }, [audioChunks]);


//     async function startRecording() {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//             const recorder = new MediaRecorder(stream);
//             recorder.ondataavailable = (event) => {
//                 setAudioChunks((currentChunks) => [...currentChunks, event.data]);
//             };
//             recorder.start();
//             setMediaRecorder(recorder);

//             console.log("Recording started");
//             setRecording(true);
//         } catch (error) {
//             console.error("Error accessing audio device:", error);
//         }
//     }

//     function stopRecording() {
//         setProcessing(true);
//         // Wait 1 second for the MediaRecorder to finish recording
//         setTimeout(() => {
//             mediaRecorder.stop();
//             setMediaRecorder(null);
//             console.log("Recording stopped");
//             setRecording(false);
//             setProcessing(false);
//         }, 1000);
//     }



//     return (
//         <div className="fixed bottom-12">
//             <button
//                 className={`px-4 py-2 text-2xl font-semibold text-white transition-colors duration-200 rounded-lg  shadow-[0_20px_50px_rgba(_255,_255,_255,_1)]
//                     ${recording
//                         ? "bg-red-600 hover:bg-red-700"
//                         : "bg-blue-600 hover:bg-blue-700"
//                     } `}
//                 onClick={!recording ? startRecording : stopRecording}
//             >
//                 {!recording ? "Speak" : "Send"} {processing ? "⏳" : ""}
//             </button>
//         </div>
//     );
// }
