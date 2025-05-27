import React, { useEffect, useState } from "react";
import webicon from "../../assets/icons/webicon.png";
import searchIcon from "../../assets/icons/search-icon.png";

import "./Header.scss";
import { Link } from "react-router-dom";
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
const Header = () => {
  const { user, isAuthenticated, logout, token } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishListOpen, setIsWishListOpen] = useState(false);

  const { cart } = useCart();
  const wishList = [
    {
      id: 1,
      name: "Khăn giấy gấu trúc Top Gia Sắc Hạ",
      price: 179000,
      image:
        "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg",
    },
    {
      id: 2,
      name: "Bánh quy Oreo Chocolate 288g",
      price: 45000,
      image:
        "http://localhost:8080/uploads/8d2bbbec-d731-4855-a270-e94c4f554eef_giaoducqp.jpg", // Thay bằng ảnh thực tế
    },
  ];

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
          <Link className="navbar-link">Kính Mắt</Link>
          <Link className="navbar-link">Giày</Link>
          <Link to={"/brands"} className="navbar-link">
            Thương Hiệu
          </Link>
          <Link to={"/about-us"} className="navbar-link">
            Về chúng tôi
          </Link>
        </div>
        <div className="header-right">
          <div className="header-search">
            <input placeholder="Tìm kiếm sản phẩm..." />
            <Link className="search-button">
              <img src={searchIcon}></img>
            </Link>
          </div>
          <Link
            className="wishlist-icon"
            to="/"
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
              wishList={wishList}
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
