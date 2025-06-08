import React, { useState } from "react";
import "../assets/styles/pages/Checkout.scss";
import {
  DollarSign, // For COD
  PhoneOutgoing, // For MOMO
  CreditCard as StripeIcon,
  ShieldCheck, // For VNPAY
} from "lucide-react";
import { useEffect } from "react";
import useQuery from "../hooks/useQuery";
import {
  calculateShippingFee,
  convertToVNDFormat,
  decryptData,
  isValidEmail,
  isValidPhoneNum,
} from "../utils/ultils";
import { getVariantsById, getVariantsByIds } from "../api/variantApi";
import useAuth from "../hooks/UseAuth";
import SelectPlace from "../components/SelectPlace";
import { toast } from "react-toastify";
import { createPayment, createPaymentCustomize } from "../api/paymentApi";
import useCart from "../hooks/UseCart";
import { getCouponByCode } from "../api/couponApi";
import { useLocation, useNavigate } from "react-router-dom";
import { createModelCustomize } from "../api/modelCustomize";
import { clearFromCart } from "../api/cartApi";

const Checkout = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [reciveEmail, setReciveEmail] = useState(false);
  const [specificAddress, setSpecificAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cartItems, setCartItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [distance, setDistance] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [isCustomized, setIsCustomized] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const shipFee = calculateShippingFee(distance);
    if (shipFee) {
      setShippingFee(shipFee);
    }
  }, [distance]);

  const subtotal = cartItems.reduce((sum, item) => {
    if (isCustomized && item.design) {
      return sum + item.design.price * item.quantity;
    } else if (item.variant) {
      return (
        sum +
        (item.variant.discountPrice > 0 || item.variant.price) * item.quantity
      );
    }
    return sum;
  }, 0);

  // Calculate discount amount based on coupon type
  const calculateDiscount = () => {
    if (!coupon) return 0;

    if (coupon.discountType === "PERCENTAGE") {
      return (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "ORDER_VALUE_BASED") {
      return coupon.discountValue; // Fixed amount discount
    }
    return 0;
  };

  const discountAmount = calculateDiscount();
  const total = subtotal - discountAmount + shippingFee; // Adding shipping, subtracting discount

  const { user, token } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const query = useQuery();
  const encrd = query.get("encrd");

  useEffect(() => {
    if (!encrd) return;
    const decryptedData = decryptData(decodeURIComponent(encrd));

    const handleFetchData = async () => {
      // Check if it's customized design or regular variant
      if (decryptedData?.isCustomized) {
        setIsCustomized(true);
        // For customized designs, we already have all the data
        const customizedItems = decryptedData?.items?.map(
          ({ quantity, design }) => ({
            quantity,
            design,
          })
        );
        setCartItems(customizedItems);
      } else {
        setIsCustomized(false);
        // For regular variants, fetch variant data
        const listIds = decryptedData?.items?.map(
          (dataItem) => dataItem.variant
        );
        const data = await getVariantsByIds(listIds);
        if (data) {
          const newCartItems = decryptedData?.items?.map(
            ({ quantity, variant, cartItemId }) => {
              const variantResponse = data.find((v) => v.id === variant);
              return { quantity, variant: variantResponse, cartItemId };
            }
          );
          setCartItems(newCartItems);
        }
      }
    };

    if (decryptedData && decryptedData?.coupon) {
      setCouponCode(decryptedData?.coupon.code);
      setCoupon(decryptedData?.coupon);
    }

    handleFetchData();
  }, [encrd]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setFirstName(user.firstname || "");
      setLastName(user.lastname || "");

      const defaultAddress = user.addressResponses?.find(
        (address) => address.isDefault
      );
      setAddress(defaultAddress?.address || "");
      setSpecificAddress(defaultAddress?.specificAddress || "");
      setPhone(defaultAddress?.phone || "");
    }
  }, [user]);

  const handleApplyCoupon = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (coupon && coupon.code === couponCode) {
      return;
    }
    if (!couponCode || couponCode.length === 0) {
      toast.error("Bạn chưa nhập mã!");
      return;
    }

    const data = await getCouponByCode(couponCode);
    if (data) {
      // Validate coupon
      const now = new Date();
      const startDate = new Date(data.couponStartDate);
      const endDate = new Date(data.couponEndDate);

      if (now < startDate) {
        toast.error("Mã giảm giá chưa có hiệu lực!");
        return;
      }

      if (now > endDate) {
        toast.error("Mã giảm giá đã hết hạn!");
        return;
      }

      if (data.minimumOrderAmount && subtotal < data.minimumOrderAmount) {
        toast.error(
          `Đơn hàng phải từ ${convertToVNDFormat(
            data.minimumOrderAmount
          )} để sử dụng mã này!`
        );
        return;
      }

      if (data.timeUsed >= data.maxUsage) {
        toast.error("Mã giảm giá đã hết lượt sử dụng!");
        return;
      }

      toast.success("Áp dụng mã thành công!");
      setCoupon(data);
    } else {
      toast.error("Mã giảm giá không đúng!");
      setCoupon(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!isValidPhoneNum(phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    if (!specificAddress) {
      toast.error("Bạn chưa điền địa chỉ");
      return;
    }

    let orderItems;

    if (isCustomized) {
      // For customized designs
      orderItems = cartItems.map((cartItem) => ({
        quantity: cartItem.quantity,
        designId: cartItem.design.id,
        // You might need to add more fields based on your API requirements
      }));

      if (orderItems) {
        const orderData = {
          email,
          couponCode: coupon?.code || "",
          address: specificAddress,
          specificAddress: specificAddress,
          paymentMethod: paymentMethod,
          notes: customerNote || "",
          shippingFee: shippingFee,
          orderItemCustomizeCreateRequests: orderItems,
          phone,
          isCustomized, // Add flag to indicate if this is a customized order
        };

        const isCart = location.state?.isCart;

        const paymentURL = await createPaymentCustomize(orderData);
        if (paymentURL) {
          window.location.href = paymentURL;
        }
      }
    } else {
      // For regular variants
      orderItems = cartItems.map((cartItem) => ({
        quantity: cartItem.quantity,
        variantId: cartItem.variant.id,
      }));

      if (orderItems) {
        const orderData = {
          email,
          couponCode: coupon?.code || "",
          address: specificAddress,
          specificAddress: specificAddress,
          paymentMethod: paymentMethod,
          notes: customerNote || "",
          orderItemCreateRequests: orderItems,
          shippingFee: shippingFee,
          phone,
          isCustomized, // Add flag to indicate if this is a customized order
        };

        const paymentURL = await createPayment(orderData);
        if (paymentURL) {
          window.location.href = paymentURL;
        }
      }
    }

    const isCart = location.state?.isCart;

    if (!isCustomized && isCart) {
      await clearCart();
    }
  };

  const paymentMethods = [
    {
      id: "COD",
      name: "Thanh toán khi nhận hàng",
      icon: <DollarSign />,
      className: "cod-payment",
    },
    {
      id: "VNPAY",
      name: "VNPAY",
      icon: <ShieldCheck />,
      className: "vnpay-payment",
    },
    {
      id: "MOMO",
      name: "Ví MOMO",
      icon: <PhoneOutgoing />,
      className: "momo-payment",
    },
    {
      id: "STRIPE",
      name: "Stripe",
      icon: <StripeIcon />,
      className: "stripe-payment",
    },
  ];

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-left">
          <div className="checkout-header">
            <h1>HHQTV Store</h1>
          </div>

          <div className="contact-section">
            <h2>Liên hệ</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "16px",
              }}
            >
              <span>Nhận tin khuyến mãi và các sản phẩm mới qua email</span>
              <input
                style={{ width: "auto" }}
                type="checkbox"
                value={reciveEmail}
                onChange={(e) => setReciveEmail(e.target.checked)}
              />
            </label>

            <input
              type="text"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="name-inputs">
              <input
                type="text"
                placeholder="Họ"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Tên"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="shipping-section">
            <h2>Địa chỉ giao hàng</h2>
            <div className="location-inputs">
              <SelectPlace
                defaultValue={specificAddress}
                onChange={setSpecificAddress}
                setDistance={setDistance}
              />

              <textarea
                placeholder="Ghi chú (tùy chọn)"
                className="customer-note"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <button className="continue-button" onClick={handleSubmit}>
            Tiếp tục thanh toán
          </button>
        </div>

        <div className="checkout-right">
          <div className="cart-summary">
            {cartItems.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-image">
                  <img
                    src={
                      isCustomized && item.design
                        ? `http://localhost:8080${item.design.imagePath}`
                        : `http://localhost:8080${item?.variant?.imagePath}` ||
                          `http://localhost:8080${item?.variant?.productResponse?.imagePath}`
                    }
                    alt={
                      isCustomized && item.design
                        ? item.design.name
                        : item?.variant?.productResponse?.productName
                    }
                    className="product-thumbnail"
                  />
                  {/* Add badge for customized items */}
                  {isCustomized && item.design && (
                    <div className="custom-badge">Tùy chỉnh</div>
                  )}
                </div>
                <div className="item-details">
                  <span className="name">
                    {isCustomized && item.design
                      ? item.design.name
                      : item?.variant?.productResponse?.productName}
                  </span>
                  <div className="item-attributes">
                    {isCustomized && item.design ? (
                      <span className="attribute">Thiết kế tùy chỉnh</span>
                    ) : (
                      <span className="attribute">
                        Loại:{" "}
                        {item?.variant?.attributeValueResponses
                          ?.map((attr) => attr.attributeValue)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="quantity">x{item.quantity}</span>
                </div>
                <span className="price">
                  {convertToVNDFormat(
                    isCustomized && item.design
                      ? item.design.price
                      : item?.variant?.discountPrice
                      ? item?.variant?.discountPrice
                      : item?.variant?.price
                  )}
                </span>
              </div>
            ))}
            <div className="cart-totals">
              <div className="subtotal">
                <span>Tổng phụ</span>
                <span>{convertToVNDFormat(subtotal.toFixed(2))}</span>
              </div>
              {discountAmount > 0 && (
                <div className="discount">
                  <span>
                    Giảm giá {coupon?.code ? `(${coupon.code})` : ""}
                    {coupon?.discountType === "PERCENTAGE"
                      ? ` (${coupon.discountValue}%)`
                      : ""}
                  </span>
                  <span>-{convertToVNDFormat(discountAmount.toFixed(2))}</span>
                </div>
              )}
              <div className="shipping">
                <span>Khoảng cách</span>
                <span>{distance} km</span>
              </div>
              <div className="shipping">
                <span>Phí vận chuyển</span>
                <span>{convertToVNDFormat(shippingFee)}</span>
              </div>
              <div className="total">
                <span>Tổng cộng</span>
                <span>{convertToVNDFormat(total.toFixed(2))}</span>
              </div>
            </div>
          </div>
          <div className="payment-options">
            <h2>Chọn phương thức thanh toán</h2>
            <div className="payment-buttons">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`payment-method ${method.className} ${
                    paymentMethod === method.id ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  {method.icon}
                  {method.name}
                </button>
              ))}
            </div>

            {paymentMethod === "STRIPE" && (
              <div className="payment-method-details">
                <div className="stripe-details">
                  <p>Thanh toán bằng thẻ quốc tế qua Stripe</p>
                  <input type="text" placeholder="Số thẻ" />
                  <div className="card-details">
                    <input type="text" placeholder="MM/YY" />
                    <input type="text" placeholder="CVV" />
                  </div>
                </div>
              </div>
            )}

            <div className="coupon-section">
              <input
                type="text"
                onChange={(e) => setCouponCode(e.target.value)}
                value={couponCode}
                placeholder="Mã giảm giá"
              />
              <button
                onClick={() => handleApplyCoupon()}
                className="apply-code"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
