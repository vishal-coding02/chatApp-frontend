import { useRef } from "react";
import { socket } from "../socket";
import api from "../api/axios";
import { useEffect } from "react";

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
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });

    return stream;
  };

  // Peer connection
  const createPeer = async (targetId: string) => {
    await ensureIceServers();

    const peer = new RTCPeerConnection({
      iceServers: iceServersRef.current,
    });

    // ICE candidate milte hi dusre ko bhejo
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

    peerRef.current = peer;
    return peer;
  };

  // CALLER: offer
  const createOffer = async (targetId: string) => {
    const stream = await getLocalStream();
    const peer = await createPeer(targetId);

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("webrtc:offer", { to: targetId, offer });
  };

  // RECEIVER: offer
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

  // CALLER: answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer),
    );
  };

  // ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
  };

  // Mute/Unmute
  const setMuted = (muted: boolean) => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  };

  // Call end cleanup
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
