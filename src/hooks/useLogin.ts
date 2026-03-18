import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { jwtTokenAction, loginAction } from "../redux/reducer/AuthReducer";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLoginUser = async () => {
    if (!loginData.email || !loginData.password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await loginUser(loginData);
      dispatch(jwtTokenAction(data.accessToken));
      dispatch(loginAction(data.userData));

      console.log(data.message);

      localStorage.setItem("userID", data.userData._id);

      socket.connect();
      socket.emit("identify", data.userData._id);

      navigate("/chatscreen");
      // Reset
      setLoginData({ email: "", password: "" });
    } catch (err: any) {
      const error = err.response?.data?.error || err.message;
      setErrorMessage(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoginUser();
    }
  };

  return {
    loginData,
    setLoginData,
    handleLoginUser,
    isLoading,
    errorMessage,
    showPassword,
    setShowPassword,
    setErrorMessage,
    handleKeyPress,
  };
};
