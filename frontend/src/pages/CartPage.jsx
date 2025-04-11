import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTrash,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/pages/CartPage.scss";
import { getCartByUserId } from "../api/cartApi";
import useAuth from "../hooks/UseAuth";
import useLoading from "../hooks/UseLoading";
import useCart from "../hooks/UseCart";
import emptyCart from "../assets/images/empty-cart.jpg";
import { Link, useNavigate } from "react-router-dom";
import { encryptData } from "../utils/ultils";
import { getCouponByCode } from "../api/couponApi";
import { toast } from "react-toastify";

const CartPage = () => {
  const [quantity, setQuantity] = useState({});
  const { cart, removeItem, addItem, clearCart, updateQuantity } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity > 0) {
      setQuantity((prev) => ({
        ...prev,
        [variantId]: newQuantity,
      }));
      // updateQuantity(cartItemId, newQuantity);
    }
  };

  useEffect(() => {
    if (cart) {
      const newQuantities = {};
      cart.cartItemResponses.forEach((cartItem) => {
        newQuantities[cartItem.variantResponse.id] = cartItem.quantity;
      });
      setQuantity(newQuantities);
    }
  }, [cart]);

  useEffect(() => {
    if (coupon && cart) {
      calculateDiscount();
    } else {
      setDiscountAmount(0);
    }
  }, [coupon, cart]);

  const calculateDiscount = () => {
    if (!coupon || !cart) return 0;

    let discount = 0;

    // Nếu là giảm theo phần trăm
    if (coupon.discountType === "PERCENTAGE") {
      discount = (cart.totalPrice * coupon.discountValue) / 100;
    }
    // Nếu là giảm theo số tiền cố định
    else if (coupon.discountType === "ORDER_VALUE_BASED") {
      if (coupon.minimumOrderAmount <= cart.totalPrice) {
        discount = coupon.discountValue;
      } else {
        toast.error(
          `Đơn hàng phải có giá trị tối thiểu ${coupon.minimumOrderAmount}`
        );
        setDiscountAmount(0);
        setCoupon(null);
        setCouponCode("");

        return;
      }
    }

    setDiscountAmount(discount);
    return discount;
  };

  const getFinalPrice = () => {
    if (!cart) return 0;
    const finalPrice = cart.totalPrice - discountAmount;
    return finalPrice > 0 ? finalPrice : 0;
  };

  const handleApplyCoupon = async () => {
    if (coupon && coupon.code === couponCode) {
      return;
    }
    if (!couponCode || couponCode.length === 0) {
      toast.error("Bạn chưa nhập mã!");
      return;
    }

    const data = await getCouponByCode(couponCode);
    if (data) {
      toast.success("Áp dụng mã thành công!");
      setCoupon(data);
    } else {
      toast.error("Mã giảm giá không đúng!");
      setCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setDiscountAmount(0);
    toast.info("Đã xóa mã giảm giá");
  };

  const handleClearCart = async () => {
    await clearCart();
    setCoupon(null);
    setCouponCode("");
    setDiscountAmount(0);
  };

  const handleUpdateCart = () => {
    if (cart) {
      // cart.cartItemResponses?
      toast.info("Đã cập nhật giỏ hàng");
    }
  };

  const handleCheckOut = () => {
    const data = cart.cartItemResponses.map((cartItem) => ({
      quantity: cartItem.quantity,
      variant: cartItem.variantResponse.id,
      cartItemId: cartItem.id,
    }));

    // Thêm thông tin coupon nếu có
    const checkoutData = {
      items: data,
      coupon: coupon || null,
      discountAmount: discountAmount,
    };

    const encryptedData = encryptData(checkoutData);
    const encodedData = encodeURIComponent(encryptedData);

    navigate(`/checkout?encrd=${encodedData}`);
  };

  return (
    <div className="cart-container">
      <div className="cart-background-image">
        <span>Giỏ hàng</span>
      </div>
      <div className="cart-body">
        {cart && cart.cartItemResponses && cart.cartItemResponses.length > 0 ? (
          <>
            <div className="cart-list">
              <div className="cart-buttons">
                <button className="update" onClick={handleUpdateCart}>
                  Cập nhật giỏ hàng
                </button>
                <button className="clear" onClick={handleClearCart}>
                  Xóa giỏ hàng
                </button>
              </div>

              {cart.cartItemResponses.map((cartItem) => (
                <div className="cart-item" key={cartItem.id}>
                  <div className="left">
                    <FontAwesomeIcon
                      onClick={() => removeItem(cartItem.id)}
                      icon={faTrash}
                      className="trash-icon"
                    />
                  </div>
                  <div className="right">
                    <div className="img-container">
                      <img
                        src={
                          `http://localhost:8080${cartItem.variantResponse?.imagePath}` ||
                          "http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg"
                        }
                        alt="Product"
                      />
                    </div>
                    <div className="product-cart-info">
                      <div className="product-name">
                        {cartItem.variantResponse?.productResponse?.productName}
                      </div>
                      <div className="product-price">
                        <div className="discount">
                          {cartItem.variantResponse?.discountPrice.toLocaleString()}{" "}
                          Đ
                        </div>
                        <div className="original">
                          {cartItem.variantResponse?.price.toLocaleString()} Đ
                        </div>
                      </div>
                      <div className="list-variant">
                        {cartItem.variantResponse?.attributeResponses?.map(
                          (attribute, index) => (
                            <div className="item" key={attribute.id || index}>
                              <div className="name">
                                {attribute.attributeName}:
                              </div>
                              <div className="value">
                                {
                                  cartItem.variantResponse
                                    ?.attributeValueResponses[index]
                                }
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      <div className="quantity">
                        <span>Số lượng:</span>
                        <div className="button">
                          <button
                            className="ex"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.variantResponse.id,
                                quantity[cartItem.variantResponse.id] - 1
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </button>
                          <div className="value">
                            {quantity[cartItem.variantResponse.id] ||
                              cartItem.quantity}
                          </div>
                          <button
                            className="plus"
                            onClick={() =>
                              handleQuantityChange(
                                cartItem.variantResponse.id,
                                quantity[cartItem.variantResponse.id] + 1
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="total">
              <div className="voucher">
                <div className="title">Nhập voucher:</div>
                <div className="voucher-input">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  {!coupon ? (
                    <button onClick={() => handleApplyCoupon()}>Áp dụng</button>
                  ) : (
                    <button
                      className="remove-coupon"
                      onClick={() => handleRemoveCoupon()}
                    >
                      Xóa mã
                    </button>
                  )}
                </div>
              </div>
              <div className="cart-total">
                <div className="price-breakdown">
                  <div className="subtotal">
                    <span>Tạm tính: </span>
                    <span>{cart.totalPrice?.toLocaleString()} Đ</span>
                  </div>

                  {coupon && (
                    <div className="discount-info">
                      <div className="coupon-applied">
                        <FontAwesomeIcon icon={faTag} className="coupon-icon" />
                        <span className="coupon-name">
                          {coupon.code} -{" "}
                          {coupon.discountType === "PERCENTAGE"
                            ? `Giảm ${coupon.discountValue}%`
                            : `Giảm ${coupon.discountValue.toLocaleString()} Đ`}
                          {coupon.maxDiscount
                            ? ` (tối đa ${coupon.maxDiscount.toLocaleString()} Đ)`
                            : ""}
                        </span>
                      </div>
                      <div className="discount-amount">
                        <span>Giảm giá: </span>
                        <span className="discount-value">
                          -{discountAmount.toLocaleString()} Đ
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="final-price">
                    <span>Tổng thanh toán: </span>
                    <span className="value">
                      {getFinalPrice().toLocaleString()} Đ
                    </span>
                  </div>
                </div>
                <button className="order" onClick={() => handleCheckOut()}>
                  Thanh toán ngay
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <img src={emptyCart} alt="Giỏ hàng trống" />
            <p>Giỏ hàng của bạn đang trống. Hãy mua sắm ngay!</p>
            <Link to={"/"} className="shop-now">
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
