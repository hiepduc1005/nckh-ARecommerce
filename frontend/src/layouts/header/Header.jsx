import React, { useEffect, useState } from "react";
import webicon from "../../assets/icons/webicon.png";
import searchIcon from "../../assets/icons/search-icon.png";

import "./Header.scss";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Topbar from "../../components/Topbar";
import useAuth from "../../hooks/UseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faHeart,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import CartPopper from "../../components/CartPopper";
import WishListPopper from "../../components/WishListPopper";
import useCart from "../../hooks/UseCart";
import { useStompSocket } from "../../hooks/UseStompSocket";
import { toast } from "react-toastify";
import { getNotificationsByUser } from "../../api/notificationApi";
import SearchDropdown from "../../components/SearchDropdown";
import { useWishlist } from "../../hooks/UseWishList";

const Header = () => {
  const { user, isAuthenticated, logout, token } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { cart } = useCart();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  const [notifications, setNotifications] = useState([]);
  const { client, connected } = useStompSocket();

  // Check if screen is mobile size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // Close mobile menu when screen size changes
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (connected && client && user) {
      const subscription = client.subscribe(`/topic/${user.id}`, (message) => {
        console.log(`Received: ${message.body}`);
        const body = JSON.parse(message.body);
        setNotifications((prevNotifs) => {
          const exists = prevNotifs.some((notif) => notif.id === body.id);
          if (exists) return prevNotifs;
          return [body, ...prevNotifs];
        });
        toast.info("Bạn có 1 thông báo mới!");
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [connected, client, user]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsByUser(user?.id, 1, 5, token);
      if (response) {
        setNotifications(response.content || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  // Handle search function
  const handleSearch = (searchTerm) => {
    const pathName = location.pathname;
    if (pathName === "/products") {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("s", searchTerm);
      newParams.delete("page");
      setSearchParams(newParams);
    } else {
      navigate(`/products?s=${searchTerm}`);
    }
    // Close mobile menu after search
    setIsMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handle link click on mobile
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = [
    { to: "/products?categories=Glasses", label: "Kính Mắt" },
    { to: "/products?categories=Sneaker", label: "Giày" },
    { to: "/brands", label: "Thương Hiệu" },
    { to: "/about-us", label: "Về chúng tôi" },
  ];

  return (
    <>
      <Topbar
        user={user}
        logout={logout}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <header className="header-container">
        <div className="header-left">
          <Link to={"/"} className="webicon-container">
            <img src={webicon} alt="Website Logo" />
          </Link>

          {/* Desktop Navigation Links */}
          {!isMobile &&
            navigationLinks.map((link, index) => (
              <Link key={index} to={link.to} className="navbar-link">
                {link.label}
              </Link>
            ))}

          {/* Mobile Navigation Links - Show first 2 */}
          {isMobile &&
            navigationLinks.slice(0, 2).map((link, index) => (
              <Link key={index} to={link.to} className="navbar-link">
                {link.label}
              </Link>
            ))}
        </div>

        <div className="header-right">
          <SearchDropdown onSearch={handleSearch} searchIcon={searchIcon} />

          <Link
            className="wishlist-icon"
            to="/wishlist"
            onMouseEnter={() => !isMobile && setIsWishListOpen(true)}
            onMouseLeave={() => !isMobile && setIsWishListOpen(false)}
            onClick={() => isMobile && handleMobileLinkClick()}
          >
            <FontAwesomeIcon
              style={{ color: "white" }}
              icon={faHeart}
              size="lg"
              color="#ff3b30"
            />
            {!isMobile && (
              <WishListPopper
                wishlist={wishlist}
                isWishListOpen={isWishListOpen}
              />
            )}
          </Link>

          <Link
            className="cart-icon"
            to="/cart"
            onMouseEnter={() => !isMobile && setIsCartOpen(true)}
            onMouseLeave={() => !isMobile && setIsCartOpen(false)}
            onClick={() => isMobile && handleMobileLinkClick()}
          >
            <FontAwesomeIcon
              style={{ color: "white" }}
              icon={faCartShopping}
              size="lg"
              color="#207355"
            />
            {cart?.cartItemResponses.length > 0 && (
              <span className="cart-badge">
                {cart?.cartItemResponses.length}
              </span>
            )}
            {!isMobile && <CartPopper isCartOpen={isCartOpen} cart={cart} />}
          </Link>

          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                size="lg"
              />
            </button>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMobile && (
          <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="mobile-nav-links">
              {navigationLinks.slice(2).map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="navbar-link"
                  onClick={handleMobileLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
