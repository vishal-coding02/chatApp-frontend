import { EndCallButton, AcceptCallButton } from "./CallUI";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

interface IncomingProps {
  onAccept: () => void;
  onReject: () => void;
}

const Incoming = ({ onAccept, onReject }: IncomingProps) => {
  const caller = useSelector((state: any) => state.call?.caller);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <div
        className={`
          fixed z-50 transition-all duration-500 ease-out
          md:hidden
          left-4 right-4
          ${isVisible ? "top-4 opacity-100" : "-top-32 opacity-0"}
        `}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar - Left side */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
                  {caller?.avatar ? (
                    <img
                      src={caller.avatar}
                      alt={caller.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-indigo-600">
                      {caller?.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                {/* Ringing animation */}
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75" />
              </div>

              {/* Caller Info */}
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-base">
                  {caller?.name || "Unknown"}
                </p>
                <p className="text-gray-500 text-xs">Incoming call...</p>
              </div>

              {/* Action Buttons - Right side */}
              <div className="flex items-center gap-2">
                <EndCallButton onEnd={onReject} />
                <AcceptCallButton onAccept={onAccept} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop View - Center Modal Style */}
      <div
        className={`
          fixed inset-0 z-50 hidden md:flex items-center justify-center
          transition-all duration-300
          ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onReject}
        />

        <div className="relative bg-white rounded-2xl shadow-xl p-8 w-80 flex flex-col items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center">
              {caller?.avatar ? (
                <img
                  src={caller.avatar}
                  alt={caller.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-3xl font-semibold text-indigo-600">
                  {caller?.name?.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>
            {/* Ringing animation */}
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75" />
          </div>

          {/* Caller Info */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              {caller?.name || "Unknown"}
            </p>
            <p className="text-sm text-gray-400 animate-pulse">
              Incoming call...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <EndCallButton onEnd={onReject} />
            <AcceptCallButton onAccept={onAccept} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Incoming;
