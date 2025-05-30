import React, { useState, useEffect } from "react";
import noOrder from "../assets/images/no-order.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../assets/styles/pages/Purchase.scss";
import { formatCurrency, formatToVNDate } from "../utils/ultils";
import { getOrdersUserByStatus } from "../api/orderApi";
import useAuth from "../hooks/UseAuth";
import ProductRating from "../components/ProductRating"; // Import component đánh giá
import { checkUserRatedProduct } from "../api/ratingApi";

const Purchase = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratedProducts, setRatedProducts] = useState({});

  const location = useLocation();

  const { token } = useAuth();
  const navigate = useNavigate();

  const getTypeFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("type") || "all";
  };

  // Updated to match backend OrderStatus enum
  const orderStatusLabels = {
    PENDING: "Chờ thanh toán",
    CANCELLED: "Đã hủy",
    PAID: "Đã thanh toán",
    PROCESSING: "Đang xử lý",
    SHIPPED: "Đã giao cho vận chuyển",
    DELIVERED: "Đã giao thành công",
    REFUNDED: "Hoàn tiền",
  };

  // Updated tabs to match new order statuses
  const tabLabels = {
    all: "Tất cả",
    pending: "Chờ thanh toán",
    paid: "Đã thanh toán",
    processing: "Đang xử lý",
    shipped: "Đang vận chuyển",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy",
    refunded: "Hoàn tiền",
  };

  const handleNavigatePurchaseProgress = (orderCode) => {
    navigate(`/user/purchase/progress/${orderCode}`);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [location.search, token]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const status = getTypeFromUrl().toUpperCase();

      const data = await getOrdersUserByStatus(token, status);
      setOrders(data);

      const deliveredOrders = data.filter(
        (order) => order.orderStatus === "DELIVERED"
      );
      const ratedStatus = {};

      for (const order of deliveredOrders) {
        for (const item of order.orderItems) {
          // Handle both customized and regular products
          const productId = item.isCustomized
            ? item.modelDesignResponse?.id
            : item.variantResponse?.productResponse?.id;

          if (productId && !(productId in ratedStatus)) {
            const isRated = await checkUserRatedProduct(productId, token);
            ratedStatus[productId] = isRated;
          }
        }
      }

      setRatedProducts(ratedStatus);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để nhóm các orderItems theo sản phẩm (product ID hoặc model design ID)
  const groupOrderItemsByProduct = (orderItems) => {
    const groupedItems = {};
    console.log(orderItems);

    orderItems.forEach((item) => {
      let productId, productInfo;

      if (item.isCustomized) {
        // Handle customized products
        productId = item.modelDesignResponse?.id;
        productInfo = {
          id: productId,
          productName:
            item.modelDesignResponse?.modelCustomizeResponse?.name ||
            "Sản phẩm tùy chỉnh",
          isCustomized: true,
          modelDesign: item.modelDesignResponse,
        };
      } else {
        // Handle regular products
        productId = item.variantResponse?.productResponse?.id;
        productInfo = {
          ...item.variantResponse.productResponse,
          isCustomized: false,
        };
      }

      if (!productId) return; // Skip if no valid product ID

      if (!groupedItems[productId]) {
        groupedItems[productId] = {
          product: productInfo,
          variants: [item],
          totalQuantity: item.quantity,
        };
      } else {
        groupedItems[productId].variants.push(item);
        groupedItems[productId].totalQuantity += item.quantity;
      }
    });

    console.log(Object.values(groupedItems));
    return Object.values(groupedItems);
  };

  const handleOpenRating = (order, product) => {
    setSelectedOrder(order);
    console.log(order);
    setSelectedProduct(product);
    setShowRating(true);
  };

  const handleCloseRating = () => {
    setShowRating(false);
    setSelectedProduct(null);
    setSelectedOrder(null);
  };

  const handleSubmitRating = (ratingData) => {
    // Thực hiện các hành động sau khi đánh giá được gửi thành công
    console.log("Rating submitted:", ratingData);

    // Đóng modal đánh giá
    handleCloseRating();

    // Hiển thị thông báo thành công
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");

    // Tải lại danh sách đơn hàng
    fetchOrders();
  };

  // Kiểm tra xem sản phẩm đã được đánh giá chưa
  const isProductRated = async (productId) => {
    const isRated = await checkUserRatedProduct(productId, token);
    console.log(productId, isRated);

    return isRated;
  };

  // Helper function to get product image
  const getProductImage = (item) => {
    if (item.isCustomized) {
      // For customized products, use model design image or a default custom image
      return item.modelDesignResponse?.imagePath
        ? `http://localhost:8080${item.modelDesignResponse.imagePath}`
        : "/default-custom-product.png"; // You should add a default image
    } else {
      // For regular products, use variant image
      return `http://localhost:8080${item.variantResponse.imagePath}`;
    }
  };

  // Helper function to get product price
  const getProductPrice = (item) => {
    if (item.isCustomized) {
      // For customized products, price might be in modelDesignResponse
      return {
        originalPrice:
          item.modelDesignResponse?.modelCustomizeResponse?.price || 0,
        discountPrice:
          item.modelDesignResponse?.modelCustomizeResponse?.discountPrice ||
          item.modelDesignResponse?.modelCustomizeResponse?.price ||
          0,
      };
    } else {
      // For regular products, use variant pricing
      return {
        originalPrice: item.variantResponse?.price || 0,
        discountPrice: item.variantResponse?.discountPrice || 0,
      };
    }
  };

  const currentType = getTypeFromUrl();

  return (
    <div className="purchase-page">
      <div className="tabs">
        {Object.keys(tabLabels).map((type) => (
          <Link
            key={type}
            to={`/user/purchase/?type=${type}`}
            className={`tab ${currentType === type ? "active" : ""}`}
          >
            {tabLabels[type]}
          </Link>
        ))}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên Sản phẩm"
        />
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : orders?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <img src={noOrder} alt="Chưa có đơn hàng" />
          </div>
          <div className="empty-text">Chưa có đơn hàng</div>
        </div>
      ) : (
        <div className="orders-list">
          {orders?.map((order) => {
            // Nhóm các orderItems theo sản phẩm
            const groupedItems = groupOrderItemsByProduct(order.orderItems);
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-date">
                      Đặt ngày: {formatToVNDate(order.createdAt)}
                    </span>
                    <span className="order-id">
                      | Mã đơn hàng: {order.code}
                    </span>
                  </div>
                  <div className="order-status">
                    <span
                      className={`status-label ${order.orderStatus.toLowerCase()}`}
                    >
                      {orderStatusLabels[order.orderStatus]}
                    </span>
                  </div>
                </div>

                {/* Hiển thị từng sản phẩm và các biến thể của nó */}
                {groupedItems.map((item) => (
                  <div key={item.product.id}>
                    {item.variants.map((variant) => {
                      const pricing = getProductPrice(variant);

                      return (
                        <div
                          key={
                            variant.id ||
                            `${item.product.id}-${
                              variant.isCustomized
                                ? "custom"
                                : variant.variantResponse?.id
                            }`
                          }
                          className="order-item"
                        >
                          <div className="item-image">
                            <img
                              src={getProductImage(variant)}
                              alt={item.product.productName}
                            />
                          </div>
                          <div className="item-details">
                            <div className="item-name">
                              {item.product.productName}
                              {variant.isCustomized && (
                                <span className="custom-indicator">
                                  {" "}
                                  (Tùy chỉnh)
                                </span>
                              )}
                            </div>
                            <div className="item-variant">
                              {variant.isCustomized ? (
                                <span>
                                  Thiết kế:{" "}
                                  <strong>
                                    {variant.modelDesignResponse?.designName ||
                                      "Thiết kế tùy chỉnh"}
                                  </strong>
                                  {variant.modelDesignResponse?.description && (
                                    <div className="custom-description">
                                      Mô tả:{" "}
                                      {variant.modelDesignResponse.description}
                                    </div>
                                  )}
                                </span>
                              ) : (
                                <span>
                                  Phân loại hàng:{" "}
                                  {variant.variantResponse?.attributeValueResponses?.map(
                                    (attributeValue, index, array) => (
                                      <span key={attributeValue.attributeName}>
                                        {attributeValue.attributeName}:{" "}
                                        <strong>
                                          {attributeValue.attributeValue}
                                        </strong>
                                        {index < array.length - 1 ? " | " : ""}
                                      </span>
                                    )
                                  ) || "Ngẫu nhiên"}
                                </span>
                              )}
                            </div>
                            <div className="item-quantity">
                              x{variant.quantity}
                            </div>
                          </div>
                          <div className="item-price">
                            <div className="original-price">
                              {formatCurrency(pricing.originalPrice)}
                            </div>
                            <div className="discount-price">
                              {formatCurrency(pricing.discountPrice)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {order.orderStatus === "DELIVERED" && (
                      <button
                        className="rate-btn"
                        onClick={() => handleOpenRating(item, item.product)}
                      >
                        {ratedProducts[item.product.id]
                          ? "CẬP NHẬT ĐÁNH GIÁ"
                          : `ĐÁNH GIÁ ${item.product.productName}`}
                      </button>
                    )}
                  </div>
                ))}

                <div className="order-footer">
                  <div className="order-summary">
                    <div className="delivery-info">
                      <div className="delivery-address">
                        <span className="label">Địa chỉ: </span>
                        <span>{order.address}</span>
                      </div>
                      {order.notes && (
                        <div className="delivery-notes">
                          <span className="label">Ghi chú: </span>
                          <span>{order.notes}</span>
                        </div>
                      )}
                    </div>
                    <div className="price-info">
                      <span className="order-total-label">Thành tiền:</span>
                      <span className="order-total-price">
                        {formatCurrency(
                          order.discountPrice
                            ? order.discountPrice
                            : order.totalPrice
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="order-actions">
                    {/* Updated order action buttons based on new statuses */}
                    {order.orderStatus === "CANCELLED" && (
                      <>
                        <button className="buy-again-btn">Mua Lại</button>
                        <button className="details-btn">
                          Xem Chi Tiết Hủy Đơn
                        </button>
                      </>
                    )}
                    {order.orderStatus === "DELIVERED" && (
                      <>
                        <button
                          className="track-btn"
                          onClick={() =>
                            handleNavigatePurchaseProgress(order.code)
                          }
                        >
                          Theo Dõi Đơn Hàng
                        </button>
                        <button className="buy-again-btn">Mua Lại</button>
                      </>
                    )}
                    {order.orderStatus === "PAID" && (
                      <>
                        <button
                          className="track-btn"
                          onClick={() =>
                            handleNavigatePurchaseProgress(order.code)
                          }
                        >
                          Theo Dõi Đơn Hàng
                        </button>
                      </>
                    )}
                    {order.orderStatus === "PENDING" && (
                      <>
                        <button className="pay-btn">Thanh Toán</button>
                        <button className="cancel-btn">Hủy Đơn Hàng</button>
                      </>
                    )}
                    {order.orderStatus === "PROCESSING" && (
                      <>
                        <button
                          className="track-btn"
                          onClick={() =>
                            handleNavigatePurchaseProgress(order.code)
                          }
                        >
                          Theo Dõi Đơn Hàng
                        </button>
                      </>
                    )}
                    {order.orderStatus === "SHIPPED" && (
                      <>
                        <button
                          className="track-btn"
                          onClick={() =>
                            handleNavigatePurchaseProgress(order.code)
                          }
                        >
                          Theo Dõi Đơn Hàng
                        </button>
                        <button className="confirm-delivery-btn">
                          Xác Nhận Đã Nhận
                        </button>
                      </>
                    )}
                    {order.orderStatus === "REFUNDED" && (
                      <>
                        <button className="buy-again-btn">Mua Lại</button>
                        <button className="details-btn">
                          Xem Chi Tiết Hoàn Tiền
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal đánh giá sản phẩm */}
      {showRating && selectedProduct && selectedOrder && (
        <ProductRating
          order={selectedOrder}
          product={selectedProduct}
          onClose={handleCloseRating}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
};

export default Purchase;
