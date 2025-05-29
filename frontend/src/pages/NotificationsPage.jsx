import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTrash,
  faCheck,
  faCheckDouble,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  deleteAllNotifi,
  deleteNotification,
  getNotificationsByUser,
  markAllAsRead,
  markAsRead,
  markAsReadByUserId,
} from "../api/notificationApi"; // Adjust import path as needed
import "../assets/styles/pages/NotificationsPage.scss";
import useAuth from "../hooks/UseAuth";
import { useStompSocket } from "../hooks/UseStompSocket";
import { toast } from "react-toastify";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  const { user, token } = useAuth();
  const { client, connected } = useStompSocket();

  useEffect(() => {
    if (connected && client && user) {
      const subscription = client.subscribe(
        `/user/${user?.id}/queue/notification`,
        (message) => {
          const body = JSON.parse(message.body);
          setNotifications((prevNotifs) => {
            const exists = prevNotifs.some((notif) => notif.id === body.id);
            if (exists) return prevNotifs;
            return [body, ...prevNotifs];
          });
          setTotalElements((total) => total + 1);
          console.log("Nhận thông báo:", body);
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [connected, client, user]);

  useEffect(() => {
    if (user && token) {
      fetchNotifications();
    }
  }, [currentPage, user, token]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotificationsByUser(
        user?.id,
        currentPage,
        itemsPerPage,
        token
      );
      if (response) {
        setNotifications(response.content || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    const allSelected = notifications.every((n) =>
      selectedNotifications.includes(n.id)
    );

    if (allSelected) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n.id));
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!token || !user) {
      return;
    }

    try {
      await markAsRead(notificationId, token);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      toast.success("Cập thông báo đã đọc thành công!");
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token || !user) {
      return;
    }

    try {
      await markAsReadByUserId(user.id, token);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    if (!token || !user) {
      return;
    }
    try {
      await markAllAsRead(selectedNotifications, token);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          selectedNotifications.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      );
      setSelectedNotifications([]);
      toast.success("Cập thông báo đã đọc thành công!");
    } catch (error) {
      console.error("Error marking selected notifications as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!token || !user) {
      return;
    }

    try {
      await deleteNotification(notificationId, token);

      // Update local state
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      setSelectedNotifications((prev) =>
        prev.filter((id) => id !== notificationId)
      );

      toast.success("Xóa thông báo thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra vui lòng thử lại!");
    }
  };

  const handleDeleteSelected = async () => {
    if (!token || !user) {
      return;
    }

    try {
      await deleteAllNotifi(selectedNotifications, token);

      // Update local state
      setNotifications((prev) =>
        prev.filter((n) => !selectedNotifications.includes(n.id))
      );
      setSelectedNotifications([]);
      toast.success("Xóa thông báo đã chọn thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra vui lòng thử lại!");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedNotifications([]); // Clear selections when changing page
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button
            onClick={handleMarkAllAsRead}
            className="quick-action-btn"
            disabled={unreadCount === 0 || loading}
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>

          <div className="notifications-stats">
            <span>{notifications.length} thông báo</span>
            {unreadCount > 0 && (
              <span className="unread-text">• {unreadCount} chưa đọc</span>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bulk-actions">
            <div className="selected-count">
              Đã chọn {selectedNotifications.length} thông báo
            </div>
            <div className="bulk-buttons">
              <button
                onClick={handleMarkSelectedAsRead}
                className="mark-read-btn"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Đánh dấu đã đọc</span>
              </button>
              <button
                onClick={handleDeleteSelected}
                className="delete-btn"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications Content */}
        <div className="notifications-content">
          {!loading && notifications.length === 0 ? (
            <div className="no-notifications">
              <div className="empty-icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <h3>Không có thông báo nào</h3>
              <p>Bạn chưa có thông báo nào</p>
            </div>
          ) : (
            !loading && (
              <>
                {/* Select All */}
                <div className="select-all-row">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={
                        notifications.length > 0 &&
                        notifications.every((n) =>
                          selectedNotifications.includes(n.id)
                        )
                      }
                      onChange={handleSelectAll}
                    />
                    <span className="checkmark"></span>
                    <span>Chọn tất cả trang này</span>
                  </label>
                </div>

                {/* Notification Items */}
                <div className="notifications-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        !notification.read ? "unread" : ""
                      } ${
                        selectedNotifications.includes(notification.id)
                          ? "selected"
                          : ""
                      }`}
                    >
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(
                            notification.id
                          )}
                          onChange={() =>
                            handleSelectNotification(notification.id)
                          }
                        />
                        <span className="checkmark"></span>
                      </label>

                      <div className="notification-icon">
                        <FontAwesomeIcon icon={faBell} />
                      </div>

                      <div
                        className="notification-content"
                        onClick={() => {
                          if (!notification.read) {
                            handleMarkAsRead(notification.id);
                          }
                          navigate(`${notification.url}`);
                        }}
                      >
                        <div className="notification-header">
                          <div className="notification-title">
                            <h3>{notification.title}</h3>
                            {!notification.read && (
                              <span className="unread-dot"></span>
                            )}
                          </div>
                          <div className="notification-time">
                            {formatTime(notification.createAt)}
                          </div>
                        </div>

                        <p className="notification-message">
                          {notification.message}
                        </p>
                      </div>

                      <button
                        className="delete-single-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                        title="Xóa thông báo"
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(currentPage - 1, 1))
                      }
                      disabled={currentPage === 1 || loading}
                      className="pagination-btn"
                    >
                      Trước
                    </button>

                    <div className="pagination-info">
                      <span>
                        Trang {currentPage} / {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(Math.min(currentPage + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || loading}
                      className="pagination-btn"
                    >
                      Tiếp
                    </button>
                  </div>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
