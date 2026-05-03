import { useRef, useEffect } from "react";
import { socket } from "../socket";
import api from "../api/axios";

export const useWebRTC = () => {
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const iceLoadedRef = useRef(false);
  const iceCandidateQueue = useRef<RTCIceCandidateInit[]>([]); // ← ADD

  const iceServersRef = useRef<RTCIceServer[]>([
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ]);

  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = true;
    });
    return stream;
  };

  const ensureIceServers = async () => {
    if (iceLoadedRef.current) return iceServersRef.current;
    try {
      const res = await api.get("/api/calls/ice-servers");
      const servers = [
        { urls: "stun:stun.l.google.com:19302" },
        ...(res.data?.iceServers || []),
      ];
      iceServersRef.current = servers;
      iceLoadedRef.current = true;
      return servers;
    } catch {
      return iceServersRef.current;
    }
  };

  useEffect(() => {
    ensureIceServers();
  }, []);

  const createPeer = async (targetId: string) => {
    const currentServers = await ensureIceServers();
    const peer = new RTCPeerConnection({
      iceServers: currentServers,
      iceTransportPolicy: "all",
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate type:", event.candidate.type);
        socket.emit("webrtc:ice", { to: targetId, candidate: event.candidate });
      }
    };

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

  const createOffer = async (targetId: string) => {
    const stream = await getLocalStream();
    const peer = await createPeer(targetId);

    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    const offer = await peer.createOffer();

    await peer.setLocalDescription(offer);
    socket.emit("webrtc:offer", { to: targetId, offer });
  };

  const createAnswer = async (
    targetId: string,
    offer: RTCSessionDescriptionInit,
  ) => {
    const stream = await getLocalStream();
    const peer = await createPeer(targetId);
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    await peer.setRemoteDescription(new RTCSessionDescription(offer));

    for (const candidate of iceCandidateQueue.current) {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    }
    iceCandidateQueue.current = [];

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    socket.emit("webrtc:answer", { to: targetId, answer });
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    await peerRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer),
    );

    for (const candidate of iceCandidateQueue.current) {
      await peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    }
    iceCandidateQueue.current = [];
  };

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerRef.current?.remoteDescription) {
      iceCandidateQueue.current.push(candidate);
      return;
    }
    await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  const setMuted = (muted: boolean) => {
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    localStreamRef.current = null;
    peerRef.current = null;
    iceCandidateQueue.current = [];
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
