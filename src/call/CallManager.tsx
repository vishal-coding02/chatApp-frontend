import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import { useEffect, useRef, useState } from "react";
import {
  incomingCall,
  acceptCall,
  endCall,
  resetCall,
  setBusy,
  incrementTime,
  rejectCall,
  missedCall,
  noAnswer,
  incrementUnreadMissed,
} from "../redux/reducer/CallReducer";
import { useWebRTC } from "../hooks/useWebRTC";
import Outgoing from "./Outgoing";
import Incoming from "./Incoming";
import Ongoing from "./Ongoing";
import CallEnded from "./CallEnded";
import IncomingWhileOngoing from "./IncomingWhileOngoing";

const RING_TIMEOUT = 30000;

const CallManager = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state: any) => state.call?.callStatus);
  const caller = useSelector((state: any) => state.call?.caller);
  const receiver = useSelector((state: any) => state.call?.receiver);
  const isMuted = useSelector((state: any) => state.call?.isMuted);

  const webrtc = useWebRTC();
  const ringTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const myId = localStorage.getItem("userID") || "";
  const callStatusRef = useRef(callStatus);

  const callTime = useSelector((state: any) => state.call?.callTime);

  const [pendingCaller, setPendingCaller] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const pendingAutoRejectRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    callStatusRef.current = callStatus;
  }, [callStatus]);

  const otherPersonId = caller?.id === myId ? receiver?.id : caller?.id;

  useEffect(() => {
    webrtc.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    if (callStatus === "ongoing") {
      callTimerRef.current = setInterval(() => {
        dispatch(incrementTime());
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [callStatus]);

  useEffect(() => {
    if (callStatus === "ended") {
      const t = setTimeout(() => {
        dispatch(resetCall());
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [callStatus]);

  const clearPendingCaller = () => {
    if (pendingAutoRejectRef.current) {
      clearTimeout(pendingAutoRejectRef.current);
      pendingAutoRejectRef.current = null;
    }
    setPendingCaller(null);
  };

  useEffect(() => {
    socket.on("call:incoming", ({ from, callerName, callType }) => {
      const currentStatus = callStatusRef.current;

      if (
        currentStatus === "ongoing" ||
        currentStatus === "calling" ||
        currentStatus === "ringing"
      ) {
        setPendingCaller({ id: from, name: callerName });

        if (pendingAutoRejectRef.current) {
          clearTimeout(pendingAutoRejectRef.current);
        }

        pendingAutoRejectRef.current = setTimeout(() => {
          socket.emit("call:reject", { to: from, reason: "no_answer" });
          setPendingCaller(null);
          pendingAutoRejectRef.current = null;
        }, RING_TIMEOUT);

        return;
      }

      dispatch(
        incomingCall({
          caller: { id: from, name: callerName },
          type: callType,
        }),
      );

      ringTimerRef.current = setTimeout(() => {
        socket.emit("call:reject", { to: from, reason: "no_answer" });
        dispatch(incrementUnreadMissed());
        dispatch(missedCall());
      }, RING_TIMEOUT);
    });

    socket.on("call:accepted", async ({ from }) => {
      dispatch(acceptCall());
      await webrtc.createOffer(from);
    });

    socket.on("call:rejected", ({ reason }) => {
      webrtc.cleanup();
      if (reason === "no_answer") {
        dispatch(noAnswer());
      } else {
        dispatch(rejectCall());
      }
    });

    socket.on("call:busy", () => {
      webrtc.cleanup();
      dispatch(setBusy());
    });

    socket.on("call:ended", () => {
      webrtc.cleanup();
      dispatch(endCall(undefined));

      clearPendingCaller();
    });

    socket.on("call:cancelled", () => {
      if (callStatusRef.current === "ringing") {
        if (ringTimerRef.current) {
          clearTimeout(ringTimerRef.current);
          ringTimerRef.current = null;
        }
        webrtc.cleanup();
        dispatch(missedCall());
        return;
      }

      clearPendingCaller();
    });

    socket.on("webrtc:offer", async ({ from, offer }) => {
      await webrtc.createAnswer(from, offer);
    });

    socket.on("webrtc:answer", async ({ answer }) => {
      await webrtc.handleAnswer(answer);
    });

    socket.on("webrtc:ice", async ({ candidate }) => {
      await webrtc.handleIceCandidate(candidate);
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:rejected");
      socket.off("call:busy");
      socket.off("call:ended");
      socket.off("call:cancelled");
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice");
    };
  }, [myId]);

  useEffect(() => {
    return () => {
      if (pendingAutoRejectRef.current) {
        clearTimeout(pendingAutoRejectRef.current);
      }
    };
  }, []);

  if (callStatus === "idle") return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
        {callStatus === "calling" && <Outgoing />}
        {callStatus === "ringing" && (
          <Incoming
            onAccept={() => {
              if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
              socket.emit("call:accept", { to: caller?.id });
              dispatch(acceptCall());
            }}
            onReject={() => {
              if (ringTimerRef.current) clearTimeout(ringTimerRef.current);
              socket.emit("call:reject", {
                to: caller?.id,
                reason: "rejected",
              });
              dispatch(resetCall());
            }}
          />
        )}
        {callStatus === "ongoing" && (
          <Ongoing
            onEnd={() => {
              socket.emit("call:end", {
                to: otherPersonId,
                type: "ongoing",
                duration: callTime,
              });

              webrtc.cleanup();
              dispatch(endCall());
            }}
          />
        )}
        {callStatus === "ended" && <CallEnded />}
      </div>

      {pendingCaller && callStatus === "ongoing" && (
        <IncomingWhileOngoing
          callerName={pendingCaller.name}
          onDismiss={() => {
            if (pendingAutoRejectRef.current) {
              clearTimeout(pendingAutoRejectRef.current);
              pendingAutoRejectRef.current = null;
            }
            socket.emit("call:reject", {
              to: pendingCaller.id,
              reason: "reject",
            });
            setPendingCaller(null);
          }}
          onTimeout={() => {
            pendingAutoRejectRef.current = null;
            socket.emit("call:reject", {
              to: pendingCaller.id,
              reason: "no_answer",
            });
            setPendingCaller(null);
          }}
        />
      )}
    </>
  );
};

export default CallManager;
