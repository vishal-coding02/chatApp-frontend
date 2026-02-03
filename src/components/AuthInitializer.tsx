import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { jwtTokenAction } from "../redux/reducer/AuthReducer";
import { socket } from "../socket";
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post(
          "/api/v1/refreshToken",
          {},
          { withCredentials: true },
        );

        dispatch(jwtTokenAction(res.data.accessToken));
      } catch {
        dispatch(jwtTokenAction(null));
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("userID");

    if (userId) {
      socket.connect();
      socket.emit("identify", userId);
      console.log("socket reconnected after refresh");
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default AuthInitializer;
