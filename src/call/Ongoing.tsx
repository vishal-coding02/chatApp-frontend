import { useSelector, useDispatch } from "react-redux";
import { toggleMute } from "../redux/reducer/CallReducer";
import { EndCallButton, MuteMic, UnMuteMic } from "./CallUI";

interface OngoingProps {
  onEnd: () => void;
}

const Ongoing = ({ onEnd }: OngoingProps) => {
  const dispatch = useDispatch();
  const caller = useSelector((state: any) => state.call?.caller);
  const receiver = useSelector((state: any) => state.call?.receiver);
  const isMuted = useSelector((state: any) => state.call?.isMuted);
  const callTime = useSelector((state: any) => state.call?.callTime);
  const myId = localStorage.getItem("userID");

  const otherPerson = caller?.id === myId ? receiver : caller;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h > 0 ? `${String(h).padStart(2, "0")}:${m}:${s}` : `${m}:${s}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
        <span className="text-3xl font-semibold text-indigo-600">
          {otherPerson?.name?.charAt(0).toUpperCase() || "?"}
        </span>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          {otherPerson?.name || "Unknown"}
        </p>
        <p className="text-sm text-gray-400">Connected</p>
      </div>

      <p className="text-sm font-medium text-indigo-500">
        {formatTime(callTime)}
      </p>

      <div className="flex items-center gap-6">
        {isMuted ? (
          <MuteMic mute={() => dispatch(toggleMute())} />
        ) : (
          <UnMuteMic unMute={() => dispatch(toggleMute())} />
        )}
        <EndCallButton onEnd={onEnd} />
      </div>
    </div>
  );
};

export default Ongoing;
