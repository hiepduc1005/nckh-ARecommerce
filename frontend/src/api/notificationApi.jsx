import axiosInstance from "../utils/axiosInstance";

export const getNotificationsByUser = async (userId, page, size, token) => {
  try {
    const res = await axiosInstance.get(
      `api/v1/notifications/user/${userId}?page=${page - 1}&size=${size}`,
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

export const markAsRead = async (notificationId, token) => {
  try {
    const res = await axiosInstance.put(
      `api/v1/notifications/${notificationId}/read`,
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

export const markAsReadByUserId = async (userId, token) => {
  try {
    const res = await axiosInstance.put(
      `api/v1/notifications/user/${userId}/read`,
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

export const markAllAsRead = async (notificationIds, token) => {
  try {
    const res = await axiosInstance.put(
      `api/v1/notifications/read`,
      notificationIds,
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

export const deleteNotification = async (notificationId, token) => {
  try {
    const res = await axiosInstance.delete(
      `api/v1/notifications/${notificationId}`,
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

export const deleteAllNotifi = async (notificationIds, token) => {
  try {
    const res = await axiosInstance.delete(`api/v1/notifications/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: notificationIds,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
