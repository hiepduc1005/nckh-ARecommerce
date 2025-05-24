import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faFilter,
  faTrash,
  faCheck,
  faCheckDouble,
  faCircle,
  faArrowLeft,
  faCalendarAlt,
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/NotificationsPage.scss";

const NotificationsPage = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onDeleteMultiple,
}) => {
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, read, unread
  const [sortType, setSortType] = useState("newest"); // newest, oldest
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    filterAndSortNotifications();
  }, [notifications, searchTerm, filterType, sortType]);

  const filterAndSortNotifications = () => {
    let filtered = [...notifications];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by read status
    if (filterType === "read") {
      filtered = filtered.filter((notification) => notification.isRead);
    } else if (filterType === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead);
    }

    // Sort notifications
    filtered.sort((a, b) => {
      const dateA = new Date(a.createAt);
      const dateB = new Date(b.createAt);
      return sortType === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotifications(filtered);
    setCurrentPage(1);
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
    const currentPageNotifications = getCurrentPageNotifications();
    const allSelected = currentPageNotifications.every((n) =>
      selectedNotifications.includes(n.id)
    );

    if (allSelected) {
      setSelectedNotifications((prev) =>
        prev.filter((id) => !currentPageNotifications.some((n) => n.id === id))
      );
    } else {
      setSelectedNotifications((prev) => [
        ...prev,
        ...currentPageNotifications
          .filter((n) => !prev.includes(n.id))
          .map((n) => n.id),
      ]);
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedNotifications.forEach((id) => {
      const notification = notifications.find((n) => n.id === id);
      if (notification && !notification.isRead && onMarkAsRead) {
        onMarkAsRead(id);
      }
    });
    setSelectedNotifications([]);
  };

  const handleDeleteSelected = () => {
    if (onDeleteMultiple) {
      onDeleteMultiple(selectedNotifications);
    } else if (onDeleteNotification) {
      selectedNotifications.forEach((id) => onDeleteNotification(id));
    }
    setSelectedNotifications([]);
  };

  const getCurrentPageNotifications = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNotifications.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          <button
            onClick={() => onMarkAllAsRead && onMarkAllAsRead()}
            className="quick-action-btn"
            disabled={unreadCount === 0}
          >
            <FontAwesomeIcon icon={faCheckDouble} />
            <span>Đánh dấu tất cả đã đọc</span>
          </button>

          <div className="notifications-stats">
            <span>{filteredNotifications.length} thông báo</span>
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
              >
                <FontAwesomeIcon icon={faCheck} />
                <span>Đánh dấu đã đọc</span>
              </button>
              <button onClick={handleDeleteSelected} className="delete-btn">
                <FontAwesomeIcon icon={faTrash} />
                <span>Xóa</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications Content */}
        <div className="notifications-content">
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <div className="empty-icon">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <h3>Không có thông báo nào</h3>
              <p>
                {searchTerm || filterType !== "all"
                  ? "Không tìm thấy thông báo phù hợp với bộ lọc"
                  : "Bạn chưa có thông báo nào"}
              </p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="select-all-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={getCurrentPageNotifications().every((n) =>
                      selectedNotifications.includes(n.id)
                    )}
                    onChange={handleSelectAll}
                  />
                  <span className="checkmark"></span>
                  <span>Chọn tất cả trang này</span>
                </label>
              </div>

              {/* Notification Items */}
              <div className="notifications-list">
                {getCurrentPageNotifications().map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      !notification.isRead ? "unread" : ""
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
                        if (!notification.isRead && onMarkAsRead) {
                          onMarkAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="notification-header">
                        <div className="notification-title">
                          <h3>{notification.title}</h3>
                          {!notification.isRead && (
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
                        onDeleteNotification &&
                          onDeleteNotification(notification.id);
                      }}
                      title="Xóa thông báo"
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
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
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
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Tiếp
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
