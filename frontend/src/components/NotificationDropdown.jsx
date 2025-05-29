import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faCircle } from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/components/NotificationDropdown.scss";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  // Format thời gian
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
      return date.toLocaleDateString("vi-VN");
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }

    navigate(`${notification.url}`);
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    if (onDeleteNotification) {
      onDeleteNotification(notificationId);
    }
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-trigger" onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon size="lg" color="#207355" icon={faBell} />
        <span>Thông báo</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown-menu">
          <div className="notification-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={() => onMarkAllAsRead && onMarkAllAsRead()}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <FontAwesomeIcon icon={faBell} size="2x" color="#ccc" />
                <p>Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div className="notification-title">
                      {!notification.read && (
                        <FontAwesomeIcon
                          icon={faCircle}
                          size="xs"
                          color="#207355"
                          className="unread-indicator"
                        />
                      )}
                      <h4>{notification.title}</h4>
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <span className="notification-time">
                      {formatTime(notification.createAt)}
                    </span>
                  </div>
                  <button
                    className="delete-notification-btn"
                    onClick={(e) =>
                      handleDeleteNotification(e, notification.id)
                    }
                    title="Xóa thông báo"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div
              className="notification-footer"
              onClick={() => navigate("/user/notifications")}
            >
              <button className="view-all-btn">Xem tất cả thông báo</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
