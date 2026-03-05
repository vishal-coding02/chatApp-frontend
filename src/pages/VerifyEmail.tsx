import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import api from "../api/axios";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "loading" | "verified" | "unverified"
  >("idle");
  const [email, setEmail] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    setToken(tokenParam);
    setVerificationStatus("idle");
  }, []);

  const handleVerify = async () => {
    if (!token) {
      setVerificationStatus("unverified");
      return;
    }

    setVerificationStatus("loading");

    try {
      const response = await api.post("/api/auth/verify-email", { token });

      if (response.data.success) {
        setVerificationStatus("verified");
        setEmail(response.data.user?.userEmail || "");
        window.history.replaceState(null, "", window.location.pathname);
      } else {
        setVerificationStatus("unverified");
      }
    } catch (err: any) {
      const error = err.response?.data?.message || "Something went wrong";
      setErrorMessage(error);
      setVerificationStatus("unverified");
      console.error("Verification error:", error);
    }
  };

  if (verificationStatus === "idle") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="pt-1 px-4">
          <div className="w-full max-w-[320px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with Logo and Icon */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  ChatHub
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Verify Your Email
              </h2>
              <p className="text-xs text-gray-600 mb-3">
                Click the button below to verify your email address.
              </p>

              <button
                onClick={handleVerify}
                className="w-full py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Verify Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationStatus === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="pt-1 px-4">
          <div className="w-full max-w-[320px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with Logo and Icon */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  ChatHub
                </span>
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
              </div>
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Verifying...
              </h2>
              <p className="text-xs text-gray-600">
                Please wait while we verify your email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verified State
  if (verificationStatus === "verified") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
        <div className="pt-1 px-4">
          <div className="w-full max-w-[320px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header with Logo and Icon */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                  ChatHub
                </span>
              </div>
            </div>

            <div className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Your Email is Verified!
              </h2>
              {email && <p className="text-xs text-gray-600 mb-2">{email}</p>}
              <p className="text-xs text-gray-500 mb-3">
                You can now start chatting with friends.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xs font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unverified State
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <div className="pt-1 px-4">
        <div className="w-full max-w-[320px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header with Logo and Icon */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-lg font-bold bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                ChatHub
              </span>
            </div>
          </div>

          <div className="p-4 text-center">
            <div className="flex justify-center mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Verification Failed
            </h2>
            <p className="text-xs text-gray-600 mb-3">{errorMessage}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
