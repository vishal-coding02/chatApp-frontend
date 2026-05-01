import { useEffect, useRef } from "react";
import { socket } from "../socket";
import api from "../api/axios";

export const useWebRTC = () => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const iceServersRef = useRef<RTCIceServer[]>([
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ]);

  const iceLoadedRef = useRef(false);

  const ensureIceServers = async () => {
    if (iceLoadedRef.current) return;

    try {
      const res = await api.get("/api/calls/ice-servers");

      iceServersRef.current = [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        ...(res.data?.iceServers || []),
      ];

      iceLoadedRef.current = true;
      console.log("ICE servers loaded:");
    } catch (err) {
      console.log("TURN fetch failed, using STUN only");
    }
  };

  useEffect(() => {
    ensureIceServers();
  }, []);

  // Mic access
  const getLocalStream = async () => {
    if (localStreamRef.current) return localStreamRef.current;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    return stream;
  };

  // Create peer
  const createPeer = async (targetId: string) => {
    await ensureIceServers();

    const peer = new RTCPeerConnection({
      iceServers: iceServersRef.current,
    });

    // ICE send
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtc:ice", {
          to: targetId,
          candidate: event.candidate,
        });
      }
    };

    // Remote audio
    peer.ontrack = (event) => {
      if (!remoteAudioRef.current) {
        remoteAudioRef.current = new Audio();
        remoteAudioRef.current.autoplay = true;
      }
      remoteAudioRef.current.srcObject = event.streams[0];
    };

    // Debug
    peer.oniceconnectionstatechange = () => {
      console.log("ICE State:", peer.iceConnectionState);
    };

    peerRef.current = peer;
    return peer;
  };

  // CALLER
  const createOffer = async (targetId: string) => {
    const stream = await getLocalStream();
    const peer = await createPeer(targetId);

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("webrtc:offer", { to: targetId, offer });
  };

  // RECEIVER
  const createAnswer = async (
    targetId: string,
    offer: RTCSessionDescriptionInit,
  ) => {
    const stream = await getLocalStream();
    const peer = await createPeer(targetId);

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    await peer.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("webrtc:answer", { to: targetId, answer });
  };

  // Handle answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
  };

  // ICE receive
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    try {
      await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.log("ICE error:", err);
    }
  };

  // Mute
  const setMuted = (muted: boolean) => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  };

  // Cleanup
  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }

    localStreamRef.current = null;
    peerRef.current = null;
  };

  return {
    createOffer,
    createAnswer,
    handleAnswer,
    handleIceCandidate,
    setMuted,
    cleanup,
  };
};
