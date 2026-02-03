import { useState } from "react";
import { MessageCircle, User, Shield, Check, X, MoreVertical, Clock, AlertCircle } from "lucide-react";

interface MessageRequest {
  id: number;
  name: string;
  username: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

const MessageRequests = () => {
  const [requests, setRequests] = useState<MessageRequest[]>([
    { id: 1, name: "Vipul Tyagi", username: "engineeringdigest.in", message: "Requested DSA Program is below 🚀", time: "2d", unread: true, avatar: "V" },
    { id: 2, name: "mycodeshala", username: "mycodeshala", message: "Check out our new course!", time: "3d", unread: true, avatar: "M" },
    { id: 3, name: "Rithik Agarwal", username: "rithik.dev", message: "Hey, let's connect!", time: "5d", unread: false, avatar: "R" },
    { id: 4, name: "Pratyush Pandey", username: "pratyush.codes", message: "Regarding the project discussion", time: "6d", unread: false, avatar: "P" },
    { id: 5, name: "Shubhaam Tiwary", username: "shubhaam.design", message: "UI/UX collaboration?", time: "1w", unread: false, avatar: "S" },
    { id: 6, name: "dev.nd.drive", username: "dev.nd.drive", message: "Sent a file for review", time: "2w", unread: false, avatar: "D" },
    { id: 7, name: "code.abhiio7", username: "code.abhiio7", message: "", time: "", unread: false, avatar: "A" },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<MessageRequest | null>(null);
  const [requestCount, setRequestCount] = useState(2);

  const handleAcceptRequest = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    setRequestCount(prev => prev - 1);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    setRequestCount(prev => prev - 1);
    setSelectedRequest(null);
  };

  const handleDeleteAll = () => {
    setRequests([]);
    setRequestCount(0);
    setSelectedRequest(null);
  };

  const handleBlockRequest = (id: number) => {
    setRequests(requests.filter(req => req.id !== id));
    setRequestCount(prev => prev - 1);
    setSelectedRequest(null);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-indigo-50/30">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Message Requests</h2>
              <p className="text-sm text-gray-600">{requestCount} new requests</p>
            </div>
          </div>
          
          <button
            onClick={handleDeleteAll}
            disabled={requests.length === 0}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${requests.length === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 border border-red-200"
              }`}
          >
            Delete All
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Open a chat to get more info about who's messaging you. They won't know that you've seen it until you accept.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Shield className="h-4 w-4 text-indigo-600" />
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            Decide who can message you
          </a>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Requests List */}
        <div className="w-2/5 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 mb-2 ${selectedRequest?.id === request.id
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${request.unread
                        ? "bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300"
                        : "bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300"
                      }`}>
                      <span className={`text-sm font-semibold ${request.unread ? "text-indigo-600" : "text-gray-600"}`}>
                        {request.avatar}
                      </span>
                    </div>
                    {request.unread && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        !
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">{request.name}</p>
                      {request.time && (
                        <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {request.time}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{request.username}</p>
                    {request.message && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{request.message}</p>
                    )}
                    {request.unread && (
                      <div className="flex items-center gap-1 mt-2">
                        <AlertCircle className="h-3 w-3 text-indigo-500" />
                        <span className="text-xs text-indigo-600 font-medium">Unread request</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Details */}
        <div className="w-3/5 p-6 overflow-y-auto">
          {selectedRequest ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-300 flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">{selectedRequest.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{selectedRequest.name}</h3>
                    <p className="text-sm text-gray-600">{selectedRequest.username}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* View Profile Button */}
              <button className="w-full mb-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 text-gray-700 font-medium rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                View profile
              </button>

              {/* Message Details */}
              <div className="space-y-4 mb-8">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs font-medium rounded-full">
                    Fri 20:31
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{selectedRequest.username}</span> messaged you about a comment that you made on their post.
                  </p>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    See post
                  </a>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-gray-800 font-medium mb-2">Hey 👋</p>
                  <p className="text-sm text-gray-700 mb-3">Requested DSA Program is below 🚀</p>
                  <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
                    Click here
                  </button>
                </div>
              </div>

              {/* Action Prompt */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-6">
                  Accept message request from {selectedRequest.name} ({selectedRequest.username})?
                  If you accept, they will also be able to call you and see info such as your activity status and when you've read messages.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleBlockRequest(selectedRequest.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 font-medium rounded-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(selectedRequest.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-medium rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-300"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAcceptRequest(selectedRequest.id)}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a request</h3>
              <p className="text-gray-600 text-center max-w-md">
                Click on a message request from the left panel to view details and take action.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageRequests;