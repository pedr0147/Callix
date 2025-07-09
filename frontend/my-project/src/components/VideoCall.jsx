/*import { useWebRTCStore } from "../store/useWebRTCStore";
import { useEffect, useState, useRef } from "react";
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  StopCircle,
  PlayCircle,
} from "lucide-react";

const VideoCall = ({ localStream, remoteStream, onClose }) => {
  const {
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    isMuted,
    isCameraOff,
    isScreenSharing,
  } = useWebRTCStore();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Start recording screen and audio
  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
      mediaRecorderRef.current = recorder;
      recordedChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `callRecord-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setIsRecording(true);

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
      });
    } catch (err) {
      console.error("Error while sharing screen:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    const remoteVideo = document.getElementById("remoteVideo");
    if (remoteVideo && remoteStream) remoteVideo.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    const localVideo = document.getElementById("localVideo");
    if (localVideo && localStream) localVideo.srcObject = localStream;
  }, [localStream]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full p-2">
        <video
          id="remoteVideo"
          className="w-full h-full max-h-[70vh] sm:max-h-[60vh] object-contain bg-gray-900 rounded-lg"
          autoPlay
          playsInline
        ></video>

        <video
          id="localVideo"
          className="w-28 h-20 sm:w-40 sm:h-32 bg-gray-800 rounded-lg border-2 border-white absolute right-4 bottom-[5rem] sm:bottom-4 transition-all duration-300"
          autoPlay
          playsInline
          muted
        ></video>
      </div>

      <div className="w-full px-4 py-3 bg-black/80 flex justify-center gap-3 flex-wrap fixed bottom-0 z-50">
        <button onClick={toggleMute} className="btn btn-circle">
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button onClick={toggleCamera} className="btn btn-circle">
          {isCameraOff ? <VideoOff /> : <Video />}
        </button>

        <button onClick={toggleScreenShare} className="btn btn-circle">
          {isScreenSharing ? <MonitorOff /> : <Monitor />}
        </button>

        <button onClick={onClose} className="btn btn-circle bg-red-600 hover:bg-red-700 text-white">
          <PhoneOff />
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`btn btn-circle ${isRecording ? "bg-red-700" : "bg-gray-800"} text-white`}
          title={isRecording ? "Stop recording" : "Record call"}
        >
          {isRecording ? <StopCircle /> : <PlayCircle />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;*/

/*import { useWebRTCStore } from "../store/useWebRTCStore";
import { useEffect, useState, useRef } from "react";
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  StopCircle,
  PlayCircle,
} from "lucide-react";

const VideoCall = ({ localStream, remoteStream, onClose }) => {
  const {
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    isMuted,
    isCameraOff,
    isScreenSharing,
  } = useWebRTCStore();

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // For draggable local video
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);

  const startDrag = (e) => {
    dragging.current = true;
    dragStart.current = {
      x: e.clientX || e.touches?.[0]?.clientX,
      y: e.clientY || e.touches?.[0]?.clientY,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", endDrag);
  };

const onDrag = (e) => {
  if (!dragging.current) return;
  const clientX = e.clientX || e.touches?.[0]?.clientX;
  const clientY = e.clientY || e.touches?.[0]?.clientY;

  setPos((prev) => {
    const newX = prev.x + (clientX - dragStart.current.x);
    const newY = prev.y + (clientY - dragStart.current.y);

    // Basic boundary limits (prevenir que "fuja" do ecrã)
    const maxX = window.innerWidth - 100; // ajuste conforme tamanho do video
    const maxY = window.innerHeight - 100;

    return {
      x: Math.min(Math.max(newX, -maxX), maxX),
      y: Math.min(Math.max(newY, -maxY), maxY),
    };
  });

  dragStart.current = { x: clientX, y: clientY };
};

  const endDrag = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", endDrag);
  };

  // Start recording screen and audio
  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
      mediaRecorderRef.current = recorder;
      recordedChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `callRecord-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setIsRecording(true);

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
      });
    } catch (err) {
      console.error("Error while sharing screen:", err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    const remoteVideo = document.getElementById("remoteVideo");
    if (remoteVideo && remoteStream) remoteVideo.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    const localVideo = document.getElementById("localVideo");
    if (localVideo && localStream) localVideo.srcObject = localStream;
  }, [localStream]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
      <div className="relative flex justify-center items-center w-full h-full p-2">
        <video
          id="remoteVideo"
          className="w-full h-full max-h-[70vh] sm:max-h-[60vh] object-contain bg-gray-900 rounded-lg"
          autoPlay
          playsInline
        ></video>

        // Local video draggable
        <div
          style={{
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            touchAction: "none",
            bottom: "5rem", // posição inicial acima dos botões
            right: "1rem",
            position: "absolute",
            zIndex: 50,
            cursor: "grab",
          }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          className="absolute z-50 cursor-move drag-boundaries transition-transform duration-300 ease-in-out"
        >
          <video
            id="localVideo"
            style={{
              pointerEvents: "none",
            }}
            className="w-28 h-20 sm:w-40 sm:h-32 bg-gray-800 rounded-lg border-2 border-white shadow-lg"
            autoPlay
            playsInline
            muted
          ></video>
        </div>
      </div>

      // Control buttons 
      <div className="w-full px-4 py-3 bg-black/80 flex justify-center gap-3 flex-wrap fixed bottom-0 z-40">
        <button onClick={toggleMute} className="btn btn-circle">
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button onClick={toggleCamera} className="btn btn-circle">
          {isCameraOff ? <VideoOff /> : <Video />}
        </button>

        <button onClick={toggleScreenShare} className="btn btn-circle">
          {isScreenSharing ? <MonitorOff /> : <Monitor />}
        </button>

        <button onClick={onClose} className="btn btn-circle bg-red-600 hover:bg-red-700 text-white">
          <PhoneOff />
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`btn btn-circle ${isRecording ? "bg-red-700" : "bg-gray-800"} text-white`}
          title={isRecording ? "Stop recording" : "Record call"}
        >
          {isRecording ? <StopCircle /> : <PlayCircle />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;*/

import { useWebRTCStore } from "../store/useWebRTCStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  StopCircle,
  PlayCircle,
  VolumeX
} from "lucide-react";

const VideoCall = ({ localStream, remoteStream, onClose }) => {
  const {
    toggleMute,
    toggleCamera,
    toggleScreenShare,
    isMuted,
    isCameraOff,
    isScreenSharing,
  } = useWebRTCStore();

  const { selectedUser } = useChatStore();

  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0); // Timer in seconds

  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Start call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Start recording screen and audio
  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioStream.getAudioTracks(),
      ]);

      const recorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
      mediaRecorderRef.current = recorder;
      recordedChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `callRecord-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setIsRecording(true);

      screenStream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
      });
    } catch (err) {
      console.error("Error while sharing screen:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    const remoteVideo = document.getElementById("remoteVideo");
    if (remoteVideo && remoteStream) remoteVideo.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    const localVideo = document.getElementById("localVideo");
    if (localVideo && localStream) localVideo.srcObject = localStream;
  }, [localStream]);

  // Format timer
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col justify-center items-center z-50">
      {/* Top bar → Name + Timer */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white flex items-center gap-4 text-sm bg-black/50 px-4 py-1 rounded-full">
        <span>{selectedUser?.name || "User"}</span>
        <span className="text-xs">{formatDuration(callDuration)}</span>
      </div>

      {/* Remote video */}
      <div className="relative flex justify-center items-center w-full h-full p-2">
        <video
          id="remoteVideo"
          className="w-full h-full max-h-[70vh] sm:max-h-[60vh] object-contain bg-gray-900 rounded-lg"
          autoPlay
          playsInline
        ></video>

        {/* Mute indicator */}
        {isMuted && (
          <div className="absolute top-4 left-4 bg-black/60 p-1 rounded-full text-white">
            <VolumeX size={18} />
          </div>
        )}

        {/* Fixed Local Camera */}
        <video
          id="localVideo"
          className="w-28 h-20 sm:w-40 sm:h-32 bg-gray-800 rounded-lg border-2 border-white absolute right-4 bottom-[6rem] sm:bottom-[5rem] transition-all duration-300"
          autoPlay
          playsInline
          muted
        ></video>
      </div>

      {/* Controls */}
      <div className="w-full px-4 py-3 bg-black/80 flex justify-center gap-3 flex-wrap fixed bottom-0 z-50">
        <button onClick={toggleMute} className="btn btn-circle">
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button onClick={toggleCamera} className="btn btn-circle">
          {isCameraOff ? <VideoOff /> : <Video />}
        </button>

        <button onClick={toggleScreenShare} className="btn btn-circle">
          {isScreenSharing ? <MonitorOff /> : <Monitor />}
        </button>

        <button onClick={onClose} className="btn btn-circle bg-red-600 hover:bg-red-700 text-white">
          <PhoneOff />
        </button>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`btn btn-circle ${isRecording ? "bg-red-700" : "bg-gray-800"} text-white`}
          title={isRecording ? "Stop recording" : "Record call"}
        >
          {isRecording ? <StopCircle /> : <PlayCircle />}
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
