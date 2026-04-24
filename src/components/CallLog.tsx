import { useState, useEffect } from "react";
import { Phone, PhoneCall, PhoneMissed, X, Trash2 } from "lucide-react";
import api from "../api/axios";
import type { CallLog, CallLogProps } from "../interfaces/call";

const CallLog = ({ isOpen, onClose }: CallLogProps) => {
  const [missedCalls, setMissedCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMissedCalls = async () => {
      setLoading(true);
      try {
        const res = await api("/api/calls/missed");
        const data = res.data;
        if (data.success) {
          setMissedCalls(data.missCalls);
        }
      } catch (err: any) {
        console.log(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMissedCalls();
  }, [isOpen]);

  const removeMissCall = (id: string) => {
    setMissedCalls(missedCalls.filter((c) => c._id !== id));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `${time} • Today`;
    if (isYesterday) return `${time} • Yesterday`;
    return `${time} • ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 md:bg-black/30"
        onClick={onClose}
      />

      <div className="fixed top-0 right-0 h-full w-full md:w-100 bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <PhoneMissed className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Missed Calls
              </h2>
              <p className="text-xs text-gray-500">
                {missedCalls.length} missed call
                {missedCalls.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : missedCalls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <PhoneCall className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No missed calls</p>
              <p className="text-xs text-gray-400 mt-1">
                Your missed calls will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {missedCalls.map((call) => (
                <div
                  key={call._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center shrink-0 overflow-hidden">
                      {call.callerId?.profilePic ? (
                        <img
                          src={call.callerId.profilePic}
                          alt={call.callerId.userFullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-indigo-600">
                          {call.callerId?.userFullName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 truncate">
                          {call.callerId?.userFullName}
                        </p>
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                          Missed
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        @{call.callerId?.userName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(call.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title="Call back"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeMissCall(call._id)}
                        className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {missedCalls.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setMissedCalls([])}
              className="w-full py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CallLog;
