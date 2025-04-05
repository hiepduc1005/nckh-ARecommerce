import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const googleLoginUser = async (idToken) => {
  try {
    const res = await axiosInstance.post("api/v1/oauth2/google/token", {
      id_token: idToken,
    });

    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    toast.error("Đăng nhập thất bại!");
    throw error;
  }
};

export const facebookLoginUser = async (accessToken) => {
  try {
    const res = await axiosInstance.post("api/v1/oauth2/facebook/token", {
      accessToken,
    });

    return res.data;
  } catch (error) {
    console.error("Login failed", error);
    toast.error("Đăng nhập thất bại!");
    throw error;
  }
};
