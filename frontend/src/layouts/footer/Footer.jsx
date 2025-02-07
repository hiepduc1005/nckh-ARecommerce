import React from "react";
import "./Footer.scss";
import { Link } from "react-router-dom";
import instagram from "../../assets/icons/instagram-icon.png";
import fb from "../../assets/icons/fb-icon.png";
import xIcon from "../../assets/icons/x-icon.png";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Header Buttons */}
      <div className="footer-header">
        <div className="button-link">Trung Tâm Trợ Giúp</div>
        <div className="button-link">Trò Chuyện Trực Tiếp</div>
        <div className="button-link">Gửi email cho chúng tôi</div>
      </div>

      {/* Footer Content */}
      <div className="footer-content">
        {/* Sản phẩm */}
        <div className="item">
          <div className="title">Sản Phẩm</div>
          <div className="links">
            <Link>Kính mắt</Link>
            <Link>Giày</Link>
            <Link>Coming soon...</Link>
          </div>
        </div>

        {/* Liên hệ */}
        <div className="item">
          <div className="title">Liên hệ với chúng tôi</div>
          <div className="links">
            <Link><img src={fb} alt="Facebook" /> Facebook</Link>
            <Link><img src={instagram} alt="Instagram" /> Instagram</Link>
            <Link><img src={xIcon} alt="X" /> X</Link>
          </div>
        </div>

        {/* Chính sách */}
        <div className="item">
          <div className="title">Về HHQTV Store</div>
          <div className="links">
            <Link>Chính sách thanh toán</Link>
            <Link>Chính sách đổi trả</Link>
            <Link>Chính sách bảo hành</Link>
            <Link>Giới thiệu</Link>
          </div>
        </div>

        {/* Google Map */}
        <div className="item map">
          <div className="title">Địa chỉ cửa hàng</div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.680823529913!2d105.77405807515055!3d21.005181188259026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abcdd1a4f2d3%3A0x14aaf33e9416f6d2!2zNDIgUC4gUGjDuiDEkWnhu4VuLCBC4bqvYyBU4buLiCDEkOG7qWMgVGhhbmggUGjDuiDEkWnhu4VuLCBIw6AgTuG7mWkgVmnDqm4!5e0!3m2!1sen!2s!4v1701234567890"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "8px" }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
