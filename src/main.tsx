import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import "./api/interceptors.js"
import Home from "./pages/v1/Home";
import Signup from "./pages/v1/Signup";
import Login from "./pages/v1/Login";
import AuthInitializer from "./components/AuthInitializer";
import store from "./redux/Strore";
import { Provider } from "react-redux";
import ChatLayout from "./components/layouts/ChatLayout";
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth/signup", element: <Signup /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/chatscreen", element: <ChatLayout /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  </StrictMode>,
);
