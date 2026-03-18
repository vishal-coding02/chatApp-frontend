import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUpUser } from "../api/auth.api";
import type { UserData } from "../interfaces/signUpInterface";

export const useSignUp = () => {
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [user, setUser] = useState<UserData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    profilePic: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    const MAX_SIZE = 200 * 1024;

    if (file?.type !== "image/webp") {
      alert("Only webp images are allowed");
      return;
    }

    if (file?.size > MAX_SIZE) {
      alert("Image is very heavy, max 200kb allowed");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setUser({
          ...user,
          profilePic: result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!user.fullName || !user.username || !user.email || !user.password) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    if (user.password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (user.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const data = await signUpUser(user);

      setSuccessMessage(data.message);
      console.log(data.message);

      setUser({
        fullName: "",
        username: "",
        email: "",
        password: "",
        profilePic: "",
      });
      setConfirmPassword("");
      setImagePreview("");

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
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
      handleCreateUser();
    }
  };

  return {
    handleCreateUser,
    handleImageUpload,
    handleKeyPress,
    user,
    setUser,
    showConfirmPassword,
    setErrorMessage,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    isLoading,
    showPassword,
    errorMessage,
    successMessage,
    imagePreview,
    confirmPassword,
  };
};
