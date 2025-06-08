import React from "react";
import "../assets/styles/components/CartPopper.scss";
import { Link, useNavigate } from "react-router-dom";
const CartPopper = ({ isCartOpen, cart }) => {
  const navigate = useNavigate();
  const handleNavigate = (url) => {
    setTimeout(() => navigate(`${url}`), 100);
  };

  return (
    <div className={`cart-popper ${!isCartOpen ? "hidden" : ""}`}>
      <div className="cart-header">Sản Phẩm Mới Thêm</div>
      <div className="cart-content">
        {cart?.cartItemResponses?.length > 0 ? (
          cart?.cartItemResponses?.map((item, index) => (
            <Link
              key={item?.id}
              className="cart-item"
              to={`/products/${item.variantResponse.productResponse.slug}`}
            >
              <img
                src={`http://localhost:8080${item.variantResponse.imagePath}`}
                alt={item.variantResponse.productResponse.productName}
                className="cart-image"
              />
              <div className="cart-details">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="cart-name">
                    {item.variantResponse.productResponse.productName}
                  </span>
                  <span className="cart-price">
                    ₫
                    {item.variantResponse.discountPrice > 0
                      ? item.variantResponse.discountPrice?.toLocaleString()
                      : item.variantResponse.price?.toLocaleString()}
                  </span>
                </div>
                <span className="cart-quantity">x{item.quantity}</span>
              </div>
            </Link>
          ))
        ) : (
          <p className="empty-cart-message">Không có sản phẩm trong giỏ</p>
        )}
      </div>
      <button onClick={() => handleNavigate("/cart")} className="cart-button">
        Xem Giỏ Hàng
      </button>
    </div>
  );
};

export default CartPopper;
