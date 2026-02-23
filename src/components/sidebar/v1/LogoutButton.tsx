import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../../api/axios";
import { logoutAction } from "../../redux/reducer/AuthReducer";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post(
        "/api/v1/auth/logout",
        {},
        { withCredentials: true },
      );

      if (res.status === 200) {
        dispatch(logoutAction());
        localStorage.removeItem("userID");
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return handleLogout;
};
