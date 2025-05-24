import axiosInstance from "../utils/axiosInstance";

export const getNotificationsByUser = async (userId, page, size) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/notifications/user/${userId}?page=${page - 1}&size=${size}`
    );

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
