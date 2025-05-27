import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

export const getAuthUser = async (token) => {
  try {
    const res = await axiosInstance.get("api/v1/users/authenticated", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error();
    return null;
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await axiosInstance.post("api/v1/auth/login", {
      email: email,
      password: password,
    });

    const token = res.data?.token;
    if (token) {
      return res.data;
    } else {
      throw new Error("No token received from server");
    }
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    const res = await axiosInstance.post("api/v1/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const registerUser = async (email, firstname, lastname, password) => {
  try {
    const res = await axiosInstance.post("api/v1/auth/register", {
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: password,
    });

    return { success: true, data: res.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        error: error.response?.data || "Có lỗi xảy ra khi đăng ký!",
      };
    }

    return {
      success: false,
      error: error.response?.data || "Không thể kết nối đến máy chủ!",
    };
  }
};

export const updateUser = async (data, token) => {
  try {
    const res = await axiosInstance.put("api/v1/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data, token) => {
  try {
    const res = await axiosInstance.put("api/v1/users/change-password", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const requestForgotPassword = async (data) => {
  try {
    const res = await axiosInstance.post(
      "api/v1/users/forgot-password/request",
      data
    );
    return res;
  } catch (error) {
    toast.error("Không thể gửi mã OTP");
  }
};

export const verifyForgotPassword = async (data) => {
  try {
    const res = await axiosInstance.post(
      "api/v1/users/forgot-password/verify",
      data
    );
    if (res.status !== 202) {
      toast.error("Mã OTP không hợp lệ");
      return null;
    }

    return res.data;
  } catch (error) {
    toast.error(error);
  }
};

export const verifyResetPassword = async (data) => {
  try {
    const res = await axiosInstance.post(
      "api/v1/users/reset-password/verify",
      data
    );

    return res.data;
  } catch (error) {
    toast.error(error);
  }
};
