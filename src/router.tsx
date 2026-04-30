import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
const Home = lazy(() => import("./pages/Home"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ChatLayout = lazy(() => import("./components/layouts/ChatLayout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

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
