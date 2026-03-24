import Navbar from "../components/layouts/Navbar";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";

const Home = () => {
  const { isAuthReady, isAuthenticated } = useSelector(
    (state: any) => state.auth,
  );
  const navigate = useNavigate();

  if (!isAuthReady) return null;
  if (isAuthenticated) return <Navigate to="/chatscreen" replace />;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Logo and Welcome Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-linear-to-r from-indigo-500 to-purple-600 mx-auto rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
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
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                ChatHub
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect, share, and chat with friends in a seamless experience
            </p>

            <div className="flex justify-center mt-10">
              <button
                onClick={() => navigate("/auth/signup")}
                className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 cursor-pointer"
              >
                Start Chatting
              </button>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                AES encryption keeps your conversations safe
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                1-on-1 Chats
              </h3>
              <p className="text-gray-600">
                Real-time personal conversations with anyone, instantly
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">
              Join thousands of users already connected
            </p>
            <button
              onClick={() => navigate("/auth/signup")}
              className="px-8 py-3 bg-linear-to-r from-gray-800 to-gray-900 text-white font-medium rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Get Started For Free
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
