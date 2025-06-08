import React, { useState, useEffect } from "react";
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

const Topbar = ({
  user,
  isAuthenticated,
  logout,
  notifications = [],
  setNotifications,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

  const navigate = useNavigate();
  const { token } = useAuth();
  const { setLoading } = useLoading();

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth <= 1024);
      // Close popper on screen resize
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClickUser = () => {
    setLoading(true);

    if (user && isAuthenticated) {
      navigate(`/user/profile`);
      setLoading(false);
      return;
    }

    navigate("/login");
    setLoading(false);
  };

  // Handle mark as read notification
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
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    // Call API to mark all notifications as read
    console.log("Mark all as read");
    // TODO: Implement API call
  };

  // Handle delete notification
  const handleDeleteNotification = (notificationId) => {
    // Call API to delete notification
    console.log("Delete notification:", notificationId);
    // TODO: Implement API call
  };

  // Get display name for user
  const getUserDisplayName = () => {
    if (!isAuthenticated || !user) return "Đăng nhập";

    const name = user?.userName || `${user.firstname} ${user.lastname}`;

    // Truncate name on mobile
    if (isMobile && name.length > 10) {
      return name.substring(0, 10) + "...";
    }

    return name;
  };

  // Handle contact item click on mobile
  const handleContactClick = (type, value) => {
    if (isMobile) {
      if (type === "email") {
        window.location.href = `mailto:${value}`;
      } else if (type === "phone") {
        window.location.href = `tel:${value}`;
      }
    }
  };

  return (
    <div className="topbar-container">
      <div className="left">
        <div
          className="email-contact"
          onClick={() => handleContactClick("email", "hhqvt@gmail.com")}
          title={isMobile ? "hhqvt@gmail.com" : ""}
        >
          <FontAwesomeIcon size="lg" icon={faEnvelope} />
          <span>hhqvt@gmail.com</span>
        </div>

        <div
          className="phone-contact"
          onClick={() => handleContactClick("phone", "0123456789")}
          title={isMobile ? "0123456789" : ""}
        >
          <FontAwesomeIcon size="lg" icon={faPhone} />
          <span>0123456789</span>
        </div>

        <div className="follow-us">
          {!isMobile && <span>Follow us on</span>}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook"
            aria-label="Follow us on Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            aria-label="Follow us on Instagram"
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
          isMobile={isMobile}
        />

        <Link
          className="support-icon"
          to={"/support"}
          title={isMobile ? "Hỗ trợ" : ""}
          data-tooltip="Hỗ trợ"
        >
          <FontAwesomeIcon size="lg" color="#207355" icon={faCircleQuestion} />
          {!isMobile && <span>Hỗ trợ</span>}
        </Link>

        <div
          className="user"
          onClick={(event) => {
            event.stopPropagation();
            handleClickUser();
          }}
          onMouseEnter={() => !isMobile && setIsOpen(true)}
          onMouseLeave={() => !isMobile && setIsOpen(false)}
          // Handle touch events for mobile
          onTouchStart={() => isMobile && setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon size="lg" icon={faUser} />
          <span>{getUserDisplayName()}</span>

          {isAuthenticated && user && (
            <AccountPopper
              logout={logout}
              isOpen={isOpen}
              isMobile={isMobile}
              onClose={() => setIsOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
