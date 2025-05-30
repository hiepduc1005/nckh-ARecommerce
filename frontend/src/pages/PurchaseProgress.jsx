import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderByCode } from "../api/orderApi";
import Steps from "rc-steps";
import "rc-steps/assets/index.css";
import "../assets/iconfont.css";
import "../assets/index.css";

import "../assets/styles/pages/PurchaseProgress.scss"; // Tạo file CSS này để tùy chỉnh giao diện

const PurchaseProgress = () => {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderByCode = async () => {
      setLoading(true);
      try {
        const data = await getOrderByCode(orderCode);

        if (data) {
          setOrder(data);
        } else {
          navigate("/notfound");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        navigate("/notfound");
      } finally {
        setLoading(false);
      }
    };

    if (orderCode) {
      fetchOrderByCode();
    }
  }, [orderCode, navigate]);

  const getOrderSteps = (order) => {
    // Mảng các bước mặc định cho mọi phương thức thanh toán
    const defaultSteps = [
      { title: "Đặt hàng", description: "Đơn hàng đã được tạo" },
      { title: "Xác nhận", description: "Đơn hàng đã được xác nhận" },
      { title: "Vận chuyển", description: "Đơn hàng đang được giao" },
      { title: "Hoàn thành", description: "Đơn hàng đã giao thành công" },
    ];

    // Nếu phương thức thanh toán là chuyển khoản, thêm bước thanh toán ở đầu
    if (order.paymentMethod !== "COD") {
      return [
        { title: "Đặt hàng", description: "Chờ thanh toán" },
        { title: "Thanh toán", description: "Đã thanh toán" },
        { title: "Xử lý", description: "Đang chuẩn bị hàng" },
        { title: "Vận chuyển", description: "Đang giao hàng" },
        { title: "Hoàn thành", description: "Đã giao hàng" },
      ];
    } else {
      // Với COD, không cần bước thanh toán riêng
      return [
        { title: "Đặt hàng", description: "Đơn hàng đã được tạo" },
        { title: "Xử lý", description: "Đang chuẩn bị hàng" },
        { title: "Vận chuyển", description: "Đang giao hàng" },
        { title: "Hoàn thành", description: "Đã giao và thanh toán" },
      ];
    }
  };

  const getCurrentStep = (order) => {
    const status = order.orderStatus;
    const paymentMethod = order.paymentMethod;

    if (status === "CANCELLED") {
      return -1; // Trạng thái đặc biệt cho đơn hàng bị hủy
    }

    if (status === "REFUNDED") {
      return -2; // Trạng thái đặc biệt cho đơn hàng bị hoàn tiền
    }

    if (paymentMethod === "COD") {
      switch (status) {
        case "PENDING":
          return 0;
        case "PROCESSING":
          return 1;
        case "SHIPPED":
          return 2;
        case "DELIVERED":
          return 3;
        default:
          return 0;
      }
    } else {
      // BANK_TRANSFER hoặc phương thức thanh toán khác
      switch (status) {
        case "PENDING":
          return 0;
        case "PAID":
          return 1;
        case "PROCESSING":
          return 2;
        case "SHIPPED":
          return 3;
        case "DELIVERED":
          return 4;
        default:
          return 0;
      }
    }
  };

  // Helper function to get product image
  const getItemImage = (item) => {
    if (item.isCustomized && item.modelDesignResponse) {
      // For customized products, prefer model design image
      return item.modelDesignResponse.imagePath
        ? `http://localhost:8080${item.modelDesignResponse.imagePath}`
        : item.modelDesignResponse.modelCustomizeResponse?.imagePath
        ? `http://localhost:8080${item.modelDesignResponse.modelCustomizeResponse.imagePath}`
        : "/default-custom-product.png";
    } else if (item.variantResponse) {
      // For regular products, use variant image
      return `http://localhost:8080${item.variantResponse.imagePath}`;
    }
    return "/default-product.png";
  };

  // Helper function to get product name
  const getItemName = (item) => {
    if (item.isCustomized && item.modelDesignResponse) {
      return (
        item.modelDesignResponse.modelCustomizeResponse?.name ||
        "Sản phẩm tùy chỉnh"
      );
    } else if (item.variantResponse) {
      return item.variantResponse.productResponse?.productName || "Sản phẩm";
    }
    return "Sản phẩm không xác định";
  };

  // Helper function to get variant info
  const getVariantInfo = (item) => {
    if (item.isCustomized && item.modelDesignResponse) {
      const itemType =
        item.modelDesignResponse.modelCustomizeResponse?.itemType;
      const sessionId = item.modelDesignResponse.sessionId;
      return `Thiết kế tùy chỉnh${itemType ? ` - ${itemType}` : ""}${
        sessionId ? ` (Session: ${sessionId.substring(0, 8)}...)` : ""
      }`;
    } else if (item.variantResponse) {
      return item.variantResponse.variantName || "Mặc định";
    }
    return "Không xác định";
  };

  // Helper function to get item price
  const getItemPrice = (item) => {
    if (item.isCustomized && item.modelDesignResponse) {
      return item.modelDesignResponse.modelCustomizeResponse?.price || 0;
    } else if (item.variantResponse) {
      return (
        item.variantResponse.discountPrice || item.variantResponse.price || 0
      );
    }
    return 0;
  };

  const renderOrderDetails = () => {
    if (!order) return null;

    return (
      <div className="order-details">
        <h2>Chi tiết đơn hàng #{order.code}</h2>
        <div className="order-info">
          <div className="info-row">
            <span className="label">Ngày đặt:</span>
            <span>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="info-row">
            <span className="label">Phương thức thanh toán:</span>
            <span>
              {order.paymentMethod === "COD"
                ? "Thanh toán khi nhận hàng"
                : "Chuyển khoản ngân hàng"}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Địa chỉ:</span>
            <span>{order.address}</span>
          </div>
          {order.notes && (
            <div className="info-row">
              <span className="label">Ghi chú:</span>
              <span>{order.notes}</span>
            </div>
          )}
          <div className="info-row">
            <span className="label">Tổng tiền:</span>
            <span className="total-price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                order.discountPrice ? order.discountPrice : order.totalPrice
              )}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderItems = () => {
    if (!order || !order.orderItems) return null;

    return (
      <div className="order-items">
        <h3>Sản phẩm</h3>
        <div className="items-list">
          {order.orderItems.map((item) => (
            <div key={item.id} className="item">
              <div className="item-image">
                <img
                  src={getItemImage(item)}
                  alt={getItemName(item)}
                  onError={(e) => {
                    e.target.src = "/default-product.png";
                  }}
                />
              </div>
              <div className="item-details">
                <div className="item-name">
                  {getItemName(item)}
                  {item.isCustomized && (
                    <span className="custom-indicator"> (Tùy chỉnh)</span>
                  )}
                </div>
                <div className="item-variant">
                  Phân loại: {getVariantInfo(item)}
                </div>

                <div className="item-quantity">Số lượng: x{item.quantity}</div>
                {item.isCustomized && item.modelDesignResponse?.createdAt && (
                  <div className="design-date">
                    Ngày thiết kế:{" "}
                    {new Date(
                      item.modelDesignResponse.createdAt
                    ).toLocaleDateString("vi-VN")}
                  </div>
                )}
              </div>
              <div className="item-price">
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(getItemPrice(item))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const hasCustomizedItems = () => {
    return order?.orderItems?.some((item) => item.isCustomized) || false;
  };

  if (loading) {
    return (
      <div className="loading-container">Đang tải thông tin đơn hàng...</div>
    );
  }

  if (!order) {
    return <div className="error-container">Không tìm thấy đơn hàng</div>;
  }

  const currentStep = getCurrentStep(order);
  const steps = getOrderSteps(order);
  const status =
    currentStep === -1 ? "error" : currentStep === -2 ? "finish" : "process";

  return (
    <div className="purchase-progress-container">
      <div className="progress-header">
        <h1>Theo dõi đơn hàng</h1>
        <div className="order-status">
          <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
            {order.orderStatus === "PENDING" && "Chờ thanh toán"}
            {order.orderStatus === "PAID" && "Đã thanh toán"}
            {order.orderStatus === "PROCESSING" && "Đang xử lý"}
            {order.orderStatus === "SHIPPED" && "Đang giao hàng"}
            {order.orderStatus === "DELIVERED" && "Đã giao hàng"}
            {order.orderStatus === "CANCELLED" && "Đã hủy"}
            {order.orderStatus === "REFUNDED" && "Đã hoàn tiền"}
          </span>
        </div>
      </div>

      <div className="progress-steps">
        {currentStep === -1 ? (
          <div className="canceled-order">
            <div className="canceled-icon">⚠️</div>
            <div className="canceled-text">Đơn hàng đã bị hủy</div>
            <div className="canceled-date">
              Ngày hủy: {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        ) : currentStep === -2 ? (
          <div className="refunded-order">
            <div className="refunded-icon">↩️</div>
            <div className="refunded-text">Đơn hàng đã được hoàn tiền</div>
            <div className="refunded-date">
              Ngày hoàn tiền:{" "}
              {new Date(order.updatedAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        ) : (
          <Steps
            current={currentStep}
            status={status}
            items={steps.map((step) => ({
              title: step.title,
              description: step.description,
            }))}
          />
        )}
      </div>

      {renderOrderDetails()}
      {renderItems()}

      <div className="action-buttons">
        <button
          className="back-button"
          onClick={() => navigate("/user/purchase?type=all")}
        >
          Quay lại danh sách đơn hàng
        </button>

        {order.orderStatus === "PENDING" && (
          <button className="cancel-button">Hủy đơn hàng</button>
        )}

        {order.orderStatus === "DELIVERED" && (
          <button className="review-button">Đánh giá sản phẩm</button>
        )}
      </div>
    </div>
  );
};

export default PurchaseProgress;
