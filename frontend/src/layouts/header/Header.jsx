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
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const { cart } = useCart();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();

  const [notifications, setNotifications] = useState([]);
  const { client, connected } = useStompSocket();

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

  // Hàm xử lý tìm kiếm
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
  };

  return (
    <>
      <Topbar
        user={user}
        logout={logout}
        isAuthenticated={isAuthenticated}
        notifications={notifications}
      />
      <header className="header-container">
        <div className="header-left">
          <Link to={"/"} className="webicon-container">
            <img src={webicon}></img>
          </Link>
          <Link to={"/products?categories=Glasses"} className="navbar-link">
            Kính Mắt
          </Link>
          <Link to={"/products?categories=Sneaker"} className="navbar-link">
            Giày
          </Link>
          <Link to={"/brands"} className="navbar-link">
            Thương Hiệu
          </Link>
          <Link to={"/about-us"} className="navbar-link">
            Về chúng tôi
          </Link>
        </div>
        <div className="header-right">
          <SearchDropdown onSearch={handleSearch} searchIcon={searchIcon} />
          <Link
            className="wishlist-icon"
            to="/wishlist"
            onMouseEnter={() => setIsWishListOpen(true)}
            onMouseLeave={() => setIsWishListOpen(false)}
          >
            <FontAwesomeIcon
              style={{ color: "white" }}
              icon={faHeart}
              size="lg"
              color="#ff3b30"
            />
            <WishListPopper
              wishlist={wishlist}
              isWishListOpen={isWishListOpen}
            />
          </Link>

          <Link
            className="cart-icon"
            to="/cart"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
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
            <CartPopper isCartOpen={isCartOpen} cart={cart} />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Header;
