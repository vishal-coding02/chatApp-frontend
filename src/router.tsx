import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ChatLayout from "./components/layouts/ChatLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyEmail from "./pages/VerifyEmail";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth/signup", element: <Signup /> },
  { path: "/auth/login", element: <Login /> },
  {
    path: "/chatscreen",
    element: (
      <ProtectedRoute>
        <ChatLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
]);

export default router;
