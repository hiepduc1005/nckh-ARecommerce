// messageApi.js
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify"; // Nếu bạn sử dụng toast

export const createMessage = async (data, token) => {
  try {
    const res = await axiosInstance.post("api/v1/messages", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    toast.error("Gửi tin nhắn thất bại!");
    return null;
  }
};

export const getMessageByUser = async (token, page = 0, size = 20) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/messages/user?page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
