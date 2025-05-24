import React from "react";
import defaultUser from "../assets/images/defaultUser.jpg";
import "../assets/styles/components/UserSideBar.scss";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faBell,
  faUser,
  faReceipt,
  faTicket,
  faCoins,
} from "@fortawesome/free-solid-svg-icons";

const UserSideBar = () => {
  return (
    <div className="user-sidebar-container">
      <div className="header">
        <Link className="acount-image">
          <img src={defaultUser} alt="User avatar" className="avatar" />
        </Link>
        <div className="account">
          <div className="account-name">9n4yikub10</div>
          <Link className="edit-profile">
            <FontAwesomeIcon icon={faPencil} className="icon" />
            Sửa Hồ Sơ
          </Link>
        </div>
      </div>

      <div className="content">
        <div className="menu-item">
          <Link to="/user/notifications">
            <FontAwesomeIcon icon={faBell} className="icon" />
            <span className="text">Thông Báo</span>
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/user/profile">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <span className="text">Tài Khoản Của Tôi</span>
          </Link>
        </div>

        <div className="sub-menu">
          <Link to="/user/profile" className="sub-item">
            Hồ Sơ
          </Link>
          <Link to="/user/address" className="sub-item">
            Địa Chỉ
          </Link>
          <Link to="/user/change-password" className="sub-item">
            Đổi Mật Khẩu
          </Link>
          <Link to="/user/notification-settings" className="sub-item">
            Cài Đặt Thông Báo
          </Link>
          <Link to="/user/privacy" className="sub-item">
            Những Thiết Lập Riêng Tư
          </Link>
        </div>

        <div className="menu-item">
          <Link to="/user/purchase">
            <FontAwesomeIcon icon={faReceipt} className="icon" />
            <span className="text">Đơn Mua</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserSideBar;
