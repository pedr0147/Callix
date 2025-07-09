import { useEffect } from "react";
import { useWebRTCStore } from "../store/useWebRTCStore";
import { useChatStore } from "../store/useChatStore";
import IncomingCall from "./IncomingCall";
import VideoCall from "./VideoCall";
import CallingOverlay from "./CallingOverlay";

const VideoCallManager = () => {
  const {
    initPeer,
    localStream,
    remoteStream,
    currentCall,
    endCall,
    incomingCall,
    incomingCallerInfo,
    rejectCall,
    acceptCall,
    callingUser
  } = useWebRTCStore();

  const { users } = useChatStore();

  useEffect(() => {
    initPeer();
  }, []);

  useEffect(() => {
    if (localStream) {
      const localVideo = document.getElementById("localVideo");
      if (localVideo) localVideo.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream) {
      const remoteVideo = document.getElementById("remoteVideo");
      if (remoteVideo) remoteVideo.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Identifica o utilizador que está a receber a chamada (para overlay)
  const calleeUser = users.find(u => u._id === callingUser?._id);

  // Identifica quem está a ligar (para modal de chamada a entrar)
  const callerUser = users.find(u => u._id === incomingCallerInfo?._id);

  return (
    <>
      {/* Modal de chamada iniciada (user A) */}
      {callingUser && localStream && !currentCall && (
        <CallingOverlay
          calleeName={calleeUser?.name || "Utilizador"}
          localStream={localStream}
          onCancel={endCall}
        />
      )}

      {/* Modal de chamada a entrar (user B) */}
      {incomingCall && (
        <IncomingCall
          callerName={callerUser?.name || "Desconhecido"}
          onAccept={() => acceptCall(incomingCall)}
          onReject={rejectCall}
        />
      )}

      {/* Vídeo ativo */}
      {currentCall && (
        <VideoCall
          localStream={localStream}
          remoteStream={remoteStream}
          onClose={endCall}
        />
      )}
    </>
  );
};

export default VideoCallManager;

