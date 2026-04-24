import { useEffect, useState } from "react";
import { PhoneOff } from "lucide-react";

interface Props {
  callerName: string;
  onDismiss: () => void;      
  onTimeout: () => void;      
}
const IncomingWhileOngoing = ({ callerName, onDismiss, onTimeout }: Props) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 w-80">
      <div className="bg-white border border-indigo-200 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-indigo-600 font-semibold">
            {callerName?.charAt(0).toUpperCase() || "?"}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {callerName}
          </p>
          <p className="text-xs text-indigo-500">
            Incoming call... ({timeLeft}s)
          </p>
        </div>

        {/* Reject */}
        <button
          onClick={onDismiss}
          className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
        >
          <PhoneOff className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default IncomingWhileOngoing;
