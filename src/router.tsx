import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/v1/Home";
import Signup from "./pages/v1/Signup";
import Login from "./pages/v1/Login";
import ChatLayout from "./components/layouts/v1/ChatLayout";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth/signup", element: <Signup /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/chatscreen", element: <ChatLayout /> },
]);

export default router;