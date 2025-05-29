import React, { useState } from "react";
import "../assets/styles/components/Topbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircleQuestion,
  faEnvelope,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

import { Link, useNavigate } from "react-router-dom";
import useLoading from "../hooks/UseLoading";

import AccountPopper from "./AccountPopper";
import NotificationDropdown from "./NotificationDropdown";
import { markAsRead } from "../api/notificationApi";
import useAuth from "../hooks/UseAuth";
const Topbar = ({ user, isAuthenticated, logout, notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const naviate = useNavigate();
  const { token } = useAuth();
  const { setLoading } = useLoading();

  const handleClickUser = () => {
    setLoading(true);

    if (user && isAuthenticated) {
      naviate(`/user/profile`);
      setLoading(false);
      return;
    }

    naviate("/login");
    setLoading(false);
  };

  // Xử lý đánh dấu đã đọc một thông báo

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
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Xử lý đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = () => {
    // Gọi API để đánh dấu tất cả thông báo đã đọc
    console.log("Mark all as read");
    // TODO: Implement API call
  };

  // Xử lý xóa thông báo
  const handleDeleteNotification = (notificationId) => {
    // Gọi API để xóa thông báo
    console.log("Delete notification:", notificationId);
    // TODO: Implement API call
  };
  return (
    <div className="topbar-container">
      <div className="left">
        <div className="email-contact">
          <FontAwesomeIcon size="lg" icon={faEnvelope} />
          <span>hhqvt@gmail.com</span>
        </div>
        <div className="phone-contact">
          <FontAwesomeIcon size="lg" icon={faPhone} />
          <span>0123456789</span>
        </div>
        <div className="follow-us">
          <span>Follow us on</span>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
      <div className="right">
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteNotification={handleDeleteNotification}
        />
        <Link className="support-icon" to={"/support"}>
          <FontAwesomeIcon size="lg" color="#207355" icon={faCircleQuestion} />
          <span>Hỗ trợ</span>
        </Link>
        <div
          className="user"
          onClick={(event) => {
            event.stopPropagation();
            handleClickUser();
          }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <FontAwesomeIcon size="lg" icon={faUser} />
          <span>
            {isAuthenticated && user
              ? user?.userName || user.firstname + " " + user.lastname
              : "Đăng nhập"}
          </span>
          {isAuthenticated && user ? (
            <AccountPopper logout={logout} isOpen={isOpen} />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
