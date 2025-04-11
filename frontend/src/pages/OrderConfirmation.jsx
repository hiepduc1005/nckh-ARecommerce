import { CheckCircle, XCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import "../assets/styles/pages/OrderConfirmation.scss";
import { Link, useNavigate } from "react-router-dom";
import useQuery from "../hooks/useQuery";
import { getOrderByCode } from "../api/orderApi";

const OrderConfirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get query parameters from URL
  const queryParams = useQuery();
  const orderCode = queryParams.get("orderCode");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!orderCode) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        // Replace with your actual API endpoint
        const response = await getOrderByCode(orderCode);

        setOrderData(response);

        setLoading(false);
      } catch (err) {
        setError("Không thể tra cứu đơn hàng");
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [orderCode]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="order-confirmation order-confirmation--error">
        <div className="order-confirmation__content">
          <XCircle className="order-confirmation__icon order-confirmation__icon--error" />
          <h2 className="order-confirmation__title">Lỗi</h2>
          <p className="order-confirmation__description">{error}</p>
        </div>
      </div>
    );
  }

  // Render based on order status
  const renderOrderContent = () => {
    switch (orderData?.orderStatus) {
      case "PAID" || "PROCESSING":
        return (
          <div className="order-confirmation">
            <div className="order-confirmation__content">
              <CheckCircle className="order-confirmation__icon" />
              <h2 className="order-confirmation__title">Đặt Hàng Thành Công</h2>
              <p className="order-confirmation__description">
                Chúng tôi đảm bảo quyền lợi của bạn. <br />
                Chi nhận hàng & thanh toán khi đơn mua ở trạng thái "Đang giao
                hàng".
              </p>
              <p className="order-confirmation__order-code">
                Mã đơn hàng: {orderData.code}
              </p>
              <button
                className="order-confirmation__button"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mục hàng
              </button>
            </div>
          </div>
        );

      case "CANCELLED":
        return (
          <div className="order-confirmation order-confirmation--error">
            <div className="order-confirmation__content">
              <XCircle className="order-confirmation__icon order-confirmation__icon--error" />
              <h2 className="order-confirmation__title">Đặt Hàng Thất Bại</h2>
              <p className="order-confirmation__description">
                {orderData.message ||
                  "Đơn hàng của bạn đã bị hủy. Vui lòng thử lại."}
              </p>
              <p className="order-confirmation__order-code">
                Mã đơn hàng: {orderData.code}
              </p>
              <button className="order-confirmation__button order-confirmation__button--error">
                Thử lại
              </button>
            </div>
          </div>
        );

      case "PENDING":
        return (
          <div className="order-confirmation order-confirmation--pending">
            <div className="order-confirmation__content">
              <div className="order-confirmation__icon order-confirmation__icon--pending">
                <span>?</span>
              </div>
              <h2 className="order-confirmation__title">Đơn Hàng Đang Xử Lý</h2>
              <p className="order-confirmation__description">
                Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát.
              </p>
              <p className="order-confirmation__order-code">
                Mã đơn hàng: {orderData.code}
              </p>
            </div>
          </div>
        );
    }
  };

  return renderOrderContent();
};

export default OrderConfirmation;
