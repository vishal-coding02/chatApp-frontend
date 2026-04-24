import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { toggleMute, endCall } from "../redux/reducer/CallReducer";
import { MuteMic, UnMuteMic, EndCallButton } from "./CallUI";
import { socket } from "../socket";

const Outgoing = () => {
  const dispatch = useDispatch();
  const isMuted = useSelector((state: any) => state.call?.isMuted);
  const receiver = useSelector((state: any) => state.call?.receiver);
  const [isOtherBusy, setIsOtherBusy] = useState(false);

  const handleEndCall = () => {
    socket.emit("call:end", {
      to: receiver?.id,
      type: "trying",
    });

    dispatch(endCall());
  };

  useEffect(() => {
    socket.on("call:busy", () => {
      setIsOtherBusy(true);
    });

    return () => {
      socket.off("call:busy");
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
        <span className="text-3xl font-semibold text-indigo-600">
          {receiver?.name?.charAt(0).toUpperCase() || "?"}
        </span>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          {receiver?.name || "Unknown"}
        </p>

        <p className="text-sm text-gray-400 animate-pulse">
          {isOtherBusy ? "is on another call" : "Calling..."}
        </p>
      </div>

      <div className="flex items-center gap-6">
        {isMuted ? (
          <MuteMic mute={() => dispatch(toggleMute())} />
        ) : (
          <UnMuteMic unMute={() => dispatch(toggleMute())} />
        )}
        <EndCallButton onEnd={handleEndCall} />
      </div>
    </div>
  );
};

export default Outgoing;
