import { create } from "zustand";
import Peer from "peerjs";
import { useAuthStore } from "./useAuthStore";

export const useWebRTCStore = create((set, get) => ({
  peer: null,
  currentCall: null,
  localStream: null,
  remoteStream: null,
  incomingCall: null,
  incomingCallerInfo: null,
  callingUser: null,
  isMuted: false,
  isCameraOff: false,
  isScreenSharing: false,
  screenTrack: null,

  initPeer: () => {
    const { authUser } = useAuthStore.getState();
    const { peer, incomingCall } = get();

    if (!authUser?._id || peer) return; // <- evita duplicação de peer caso os parâmetros já estejam definidos

    const newPeer = new Peer(authUser._id, {
      host: "0.peerjs.com",
      port: 443,
      path: "/",
      secure: true,
    });

    newPeer.on("open", () => set({ peer: newPeer }));

    newPeer.on("call", (call) => {
      // Evita modais duplicados se já existir uma chamada a entrar
      if (incomingCall) {
        call.close();
        return;
      }

      set({ incomingCall: call, incomingCallerInfo: { _id: call.peer } });
    });
  },

  callUser: async (calleeId) => {
    const { peer } = get();
    if (!peer) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      set({ localStream: stream });

      const call = peer.call(calleeId, stream);

      call.on("stream", (remoteStream) => {
        set({
          remoteStream,
          currentCall: call,
          callingUser: null,
        });
      });

      call.on("close", () => get().endCall());

      set({
        currentCall: call,
        callingUser: { _id: calleeId },
      });
    } catch (err) {
      console.error("Erro ao ligar:", err);
    }
  },

  acceptCall: async (call) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      set({ localStream: stream });

      call.answer(stream);
      call.on("stream", (remoteStream) => {
        set({
          remoteStream,
          currentCall: call,
          callingUser: null,
        });
      });

      set({
        incomingCall: null,
        incomingCallerInfo: null,
        callingUser: null,
      });
    } catch (err) {
      console.error("Erro ao aceitar chamada:", err);
    }
  },


  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = isMuted);
      set({ isMuted: !isMuted });
    }
  },

  toggleCamera: () => {
    const { localStream, isCameraOff } = get();
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = isCameraOff);
      set({ isCameraOff: !isCameraOff });
    }
  },

  toggleScreenShare: async () => {
    const { currentCall, screenTrack, localStream, isScreenSharing } = get();
    if (!currentCall || !localStream) return;

    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const newTrack = screenStream.getVideoTracks()[0];
        const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === "video");
        if (sender) sender.replaceTrack(newTrack);
        set({ screenTrack: newTrack, isScreenSharing: true });

        newTrack.onended = () => get().toggleScreenShare();
      } catch (err) {
        console.error("Erro ao partilhar ecrã:", err);
      }
    } else {
      const originalTrack = localStream.getVideoTracks()[0];
      const sender = currentCall.peerConnection.getSenders().find(s => s.track.kind === "video");
      if (sender) sender.replaceTrack(originalTrack);

      if (screenTrack) screenTrack.stop();
      set({ screenTrack: null, isScreenSharing: false });
    }
  },

  endCall: () => {
    const { currentCall, localStream } = get();
    if (currentCall) currentCall.close();
    if (localStream) localStream.getTracks().forEach(track => track.stop());

    set({
      currentCall: null,
      localStream: null,
      remoteStream: null,
      incomingCall: null,
      callingUser: null,
      incomingCallerInfo: null,
      isMuted: false,
      isCameraOff: false,
      isScreenSharing: false,
      screenTrack: null,
    });
  },

  rejectCall: () => {
    const { currentCall } = get();
    if (currentCall) currentCall.close();
    set({ incomingCall: null, incomingCallerInfo: null });
  },
}));



