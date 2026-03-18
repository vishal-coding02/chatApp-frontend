import { useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { jwtTokenAction } from "../redux/reducer/AuthReducer";
import { onlineUserAction } from "../redux/reducer/onlineReducer";
import { socket } from "../socket";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post(
          "/api/refreshToken",
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

      socket.on("onlineUsers", (usersArray) => {
        dispatch(onlineUserAction(usersArray));
      });

      console.log("Socket connected & listeners attached");
    }

    return () => {
      socket.off("onlineUsers");
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
