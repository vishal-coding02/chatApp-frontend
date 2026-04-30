import { useSelector } from "react-redux";

const CallEnded = () => {
  const caller = useSelector((state: any) => state.call?.caller);
  const receiver = useSelector((state: any) => state.call?.receiver);
  const endedDuration = useSelector((state: any) => state.call?.endedDuration);
  const myId = localStorage.getItem("userID");
  const endType = useSelector((state: any) => state.call?.callEndType);

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
    <div className="bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-4">
      <div className="w-20 h-20 rounded-full bg-linear-to-br from-gray-100 to-gray-200 border-2 border-gray-300 flex items-center justify-center">
        <span className="text-3xl font-semibold text-gray-500">
          {otherPerson?.name?.charAt(0).toUpperCase() || "?"}
        </span>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800">
          {otherPerson?.name || "Unknown"}
        </p>
        {endType === "rejected" && (
          <p className="text-sm text-gray-400">Call Rejected</p>
        )}
        {endType === "no_answer" && (
          <p className="text-sm text-gray-400">No Answer</p>
        )}
        {endType === "missed" && (
          <p className="text-sm text-gray-400">Missed Call</p>
        )}
        {endType === "cancelled" && (
          <p className="text-sm text-gray-400">Call Cancelled</p>
        )}
        {endType === "ended" && (
          <>
            <p className="text-sm text-gray-400">Call Ended</p>
            {endedDuration > 0 && (
              <p className="text-sm text-gray-400">
                Duration: {formatTime(endedDuration)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CallEnded;
