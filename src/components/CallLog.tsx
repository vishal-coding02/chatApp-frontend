import { useState, useEffect } from "react";
import { Phone, PhoneCall, X, Trash2 } from "lucide-react";
import api from "../api/axios";
import type { CallRecord, CallLogProps } from "../interfaces/call";
import { clearUnreadMissed } from "../redux/reducer/CallReducer";
import { useDispatch, useSelector } from "react-redux";
const myId = localStorage.getItem("userID");

const CallLog = ({ isOpen, onClose }: CallLogProps) => {
  const dispatch = useDispatch();
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "missed" | "received">(
    "all",
  );

  const unreadMissedCount = useSelector(
    (state: any) => state.call?.unreadMissedCount,
  );

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/calls/history");
      const data = res.data;
      if (data.success) {
        const sortedCalls = data.calls.sort(
          (a: CallRecord, b: CallRecord) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setCalls(sortedCalls);
      }
    } catch (err: any) {
      console.log(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCalls();
  }, [isOpen]);

  const removeCall = (id: string) => {
    setCalls(calls.filter((c) => c._id !== id));
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (date.toDateString() === now.toDateString()) return `${time} • Today`;
    if (date.toDateString() === yesterday.toDateString())
      return `${time} • Yesterday`;
    return `${time} • ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  const myCalls = calls.filter((c) => {
    if (c.callStatus === "missed") return c.receiverId?._id === myId;
    if (c.callStatus === "received") return true;
    return false;
  });

  const missedCalls = myCalls.filter(
    (c) => c.callStatus === "missed" && c.receiverId?._id === myId,
  );

  const receivedCalls = myCalls.filter((c) => c.callStatus === "received");
  const totalCalls = myCalls.length;

  const getFilteredCalls = () => {
    switch (activeTab) {
      case "missed":
        return missedCalls;
      case "received":
        return receivedCalls;
      default:
        return myCalls;
    }
  };

  const filteredCalls = getFilteredCalls();

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
              <PhoneCall className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Calls</h2>
              <p className="text-xs text-gray-500">
                {totalCalls} call{totalCalls !== 1 ? "s" : ""}
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-all duration-300 ${
              activeTab === "all"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-all duration-300 ${
              activeTab === "missed"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setActiveTab("missed");
              api.patch("/api/calls/read").catch(console.log);
              dispatch(clearUnreadMissed());
            }}
          >
            Missed
            {unreadMissedCount > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                {unreadMissedCount}
              </span>
            )}
          </button>
          <button
            className={`flex-1 py-2.5 text-center text-sm font-medium transition-all duration-300 ${
              activeTab === "received"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("received")}
          >
            Received
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredCalls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <PhoneCall className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No calls found</p>
              <p className="text-xs text-gray-400 mt-1">
                Your call history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCalls.map((call) => {
                const isCaller = call.callerId?._id === myId;
                const otherPerson = isCaller ? call.receiverId : call.callerId;
                const isMissed =
                  call.callStatus === "missed" && call.receiverId?._id === myId;

                return (
                  <div
                    key={call._id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-linear-to-r from-indigo-100 to-purple-100 border-2 border-indigo-200 flex items-center justify-center shrink-0 overflow-hidden">
                        {otherPerson?.profilePic ? (
                          <img
                            src={otherPerson.profilePic}
                            alt={otherPerson.userFullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-indigo-600">
                            {otherPerson?.userFullName
                              ?.charAt(0)
                              .toUpperCase() || "U"}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 truncate">
                            {otherPerson?.userFullName || "Unknown User"}
                          </p>
                          {isMissed ? (
                            <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                              Missed
                            </span>
                          ) : (
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                              Received
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          @{otherPerson?.userName || "username"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(call.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isMissed && (
                          <button
                            className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Call back"
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeCall(call._id)}
                          className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {totalCalls > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setCalls([])}
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
