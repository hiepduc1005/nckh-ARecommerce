import React, { useEffect, useState } from "react";
import "../assets/styles/pages/OrderManagement.scss";
import { toast } from "react-toastify";
import {
  getOrdersByStatus,
  getOrdersPaginate,
  updateOrderStatus,
} from "../api/orderApi";
import useAuth from "../hooks/UseAuth";
import { formatToVNDate } from "../utils/ultils";

// Enum for order statuses
const OrderStatus = {
  PENDING: "PENDING", // Đơn hàng vừa được tạo, đang chờ thanh toán (có thể có timeout 15 phút)
  CANCELLED: "CANCELLED", // Đơn hàng bị hủy do người dùng hoặc hệ thống (hết hạn, lỗi thanh toán, v.v.)
  PAID: "PAID", // Đơn hàng đã được thanh toán thành công
  PROCESSING: "PROCESSING", // Đơn hàng đang được xử lý (chuẩn bị hàng, xác nhận, v.v.)
  SHIPPED: "SHIPPED", // Đơn hàng đã được giao cho đơn vị vận chuyển
  DELIVERED: "DELIVERED", // Đơn hàng đã giao thành công đến người mua
  REFUNDED: "REFUNDED", // Đơn hàng đã được hoàn tiền
};

// Vietnamese language mapping for order statuses
const statusTextMap = {
  [OrderStatus.PENDING]: "Chờ thanh toán",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.PAID]: "Đã thanh toán",
  [OrderStatus.PROCESSING]: "Đang xử lý",
  [OrderStatus.SHIPPED]: "Đang giao hàng",
  [OrderStatus.DELIVERED]: "Đã giao hàng",
  [OrderStatus.REFUNDED]: "Đã hoàn tiền",
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [newStatus, setNewStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debounceSearchTerm, setDebouncedSearchTerm] = useState("");
  const { token } = useAuth();

  // Status options for filters and dropdowns
  const statusOptions = Object.values(OrderStatus).map(
    (status) => statusTextMap[status]
  );
  const filterOptions = [
    { value: "ALL", label: "Tất cả" },
    ...Object.entries(OrderStatus).map(([key, value]) => ({
      value,
      label: statusTextMap[value],
    })),
  ];

  // Thay thế phần useEffect cũ bằng logic này:

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, debounceSearchTerm]);

  // Tạo một function duy nhất để fetch orders
  const fetchOrders = async () => {
    try {
      let data;

      if (statusFilter === "ALL" && !searchTerm) {
        // Lấy tất cả orders không có filter
        data = await getOrdersPaginate(token, currentPage);
      } else {
        // Sử dụng API với filter status và search
        const status = statusFilter === "ALL" ? "ALL" : statusFilter;
        data = await getOrdersByStatus(token, status, searchTerm, currentPage);
      }

      if (data) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    }
  };

  // Xóa bỏ các useEffect cũ và các function fetchOrderByStatus, fetchOrderBysearch

  // Sửa lại handleFilterChange
  const handleFilterChange = async (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  // Thêm debounce cho search
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset về trang đầu khi search

    // Clear timeout cũ
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set timeout mới
    const newTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  useEffect(() => {
    setDebouncedSearchTerm(searchTerm);
  }, []);
  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);
  // Check if status transition is valid
  const isValidStatusTransition = (current, next) => {
    switch (current) {
      case OrderStatus.PENDING:
        return [
          OrderStatus.CANCELLED,
          OrderStatus.PAID,
          OrderStatus.PROCESSING,
        ].includes(next);
      case OrderStatus.PAID:
        return [
          OrderStatus.PROCESSING,
          OrderStatus.REFUNDED,
          OrderStatus.SHIPPED,
        ].includes(next);
      case OrderStatus.PROCESSING:
        return [OrderStatus.SHIPPED, OrderStatus.CANCELLED].includes(next);
      case OrderStatus.SHIPPED:
        return [OrderStatus.DELIVERED].includes(next);
      case OrderStatus.DELIVERED:
        return [OrderStatus.REFUNDED].includes(next);
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return false; // Cannot transition from final states
      default:
        return false;
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus || !selectedOrder) return;

    // Convert displayed status back to enum value
    const selectedStatusEnum = Object.keys(statusTextMap).find(
      (key) => statusTextMap[key] === newStatus
    );

    if (
      !isValidStatusTransition(
        selectedOrder.status || selectedOrder.orderStatus,
        selectedStatusEnum
      )
    ) {
      toast.error(
        `Không thể chuyển trạng thái từ ${
          statusTextMap[selectedOrder.status || selectedOrder.orderStatus]
        } sang ${newStatus}`
      );
      return;
    }

    const dataUpdate = {
      orderId: selectedOrder.id,
      orderStatus: selectedStatusEnum,
    };

    const data = await updateOrderStatus(token, dataUpdate);

    if (data) {
      setSelectedOrder(data);
      fetchOrder();
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } else {
      toast.error("Không thể cập nhật được trạng thái đơn hàng!");
    }

    setShowStatusModal(false);
    setNewStatus("");
  };

  const calculateTotal = (products) => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return "delivered";
      case OrderStatus.SHIPPED:
        return "shipping";
      case OrderStatus.PROCESSING:
        return "processing";
      case OrderStatus.CANCELLED:
        return "cancelled";
      case OrderStatus.REFUNDED:
        return "refunded";
      case OrderStatus.PAID:
        return "paid";
      case OrderStatus.PENDING:
        return "pending";
      default:
        return "default";
    }
  };

  // Helper function to get product name and price for customized vs regular products
  const getProductInfo = (product) => {
    if (product.isCustomized && product.modelDesignResponse) {
      // For customized products
      return {
        name:
          product.modelDesignResponse.modelCustomizeResponse?.name ||
          product.variantResponse?.productResponse?.productName ||
          "Sản phẩm tùy chỉnh",
        price:
          product.modelDesignResponse.modelCustomizeResponse?.price ||
          product.variantResponse?.discountPrice ||
          product.variantResponse?.price ||
          0,
        isCustomized: true,
        designInfo: product.modelDesignResponse,
      };
    } else {
      // For regular products
      return {
        name:
          product.variantResponse?.productResponse?.productName || "Sản phẩm",
        price:
          product.variantResponse?.discountPrice ||
          product.variantResponse?.price ||
          0,
        isCustomized: false,
        designInfo: product?.variantResponse?.imagePath,
      };
    }
  };

  const getPaginationRange = (currentPage, totalPages) => {
    const delta = 2; // Số trang hiển thị ở mỗi bên của trang hiện tại
    const range = [];
    const rangeWithDots = [];

    // Tính toán phạm vi trang
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Luôn hiển thị trang đầu
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Thêm các trang trong phạm vi
    rangeWithDots.push(...range);

    // Luôn hiển thị trang cuối
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="order-tracking-page">
      <div className="container">
        <h1>Quản Lý Đơn Hàng</h1>
        <div className="top-search-bar">
          <div className="search-section">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, khách hàng, email..."
              value={searchTerm}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
              className="main-search-input"
            />
            <button className="search-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="content-wrapper">
          {/* Danh sách đơn hàng */}
          <div className="orders-list">
            <div className="search-controls">
              <div className="search-form">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  {filterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="orders-container">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id || order.code}
                    className={`order-item ${
                      selectedOrder?.id === order.id ||
                      selectedOrder?.code === order.code
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="header">
                      <span className="order-id">{order.code || order.id}</span>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.orderStatus || order.status
                        )}`}
                      >
                        {statusTextMap[order.orderStatus || order.status]}
                      </span>
                    </div>
                    <div className="customer-name">
                      {order.email || order.customer}
                    </div>
                    <div className="order-date">
                      {order.createdAt || order.createDate}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">Không tìm thấy đơn hàng nào</div>
              )}
            </div>

            {orders.length > 0 && totalPages > 1 && (
              <div className="pagination">
                {/* Nút Previous */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  &laquo; Trước
                </button>

                {/* Các số trang */}
                {getPaginationRange(currentPage, totalPages).map(
                  (page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`dots-${index}`} className="pagination-dots">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`pagination-button ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                {/* Nút Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Sau &raquo;
                </button>

                {/* Thông tin trang hiện tại */}
                <div className="pagination-info">
                  Trang {currentPage} / {totalPages}
                </div>
              </div>
            )}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="order-details">
            {selectedOrder ? (
              <div>
                <div className="header">
                  <h2>
                    Chi tiết đơn hàng #{selectedOrder.code || selectedOrder.id}
                  </h2>
                  <button onClick={() => setShowStatusModal(true)}>
                    Cập nhật trạng thái
                  </button>
                </div>

                <div className="customer-info-grid">
                  <div className="info-block">
                    <h3>Thông tin khách hàng</h3>
                    <p>{selectedOrder.email || selectedOrder.customer}</p>
                    <p>{selectedOrder.phone}</p>
                    <p className="address">
                      {selectedOrder.address}{" "}
                      {selectedOrder.specificAddress
                        ? `, ${selectedOrder.specificAddress}`
                        : ""}
                    </p>
                    {selectedOrder.notes && (
                      <p>Ghi chú: {selectedOrder.notes}</p>
                    )}
                  </div>
                  <div className="info-block">
                    <h3>Thông tin đơn hàng</h3>
                    <p>
                      Ngày tạo:{" "}
                      {formatToVNDate(
                        selectedOrder.createdAt || selectedOrder.createDate
                      )}
                    </p>
                    <p>
                      Trạng thái:
                      <span
                        className={`status-badge ${getStatusClass(
                          selectedOrder.orderStatus || selectedOrder.status
                        )}`}
                      >
                        {
                          statusTextMap[
                            selectedOrder.orderStatus || selectedOrder.status
                          ]
                        }
                      </span>
                    </p>
                    <p>
                      Phương thức thanh toán:{" "}
                      {selectedOrder.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Thêm phần mã giảm giá nếu có */}
                {selectedOrder.couponResponse && (
                  <div className="coupon-section">
                    <h3>Mã giảm giá</h3>
                    <div className="coupon-info">
                      <div className="coupon-code">
                        {selectedOrder.couponResponse.code}
                      </div>
                      <div className="coupon-description">
                        {selectedOrder.couponResponse.couponDescription}
                      </div>
                      <div className="coupon-details">
                        <p>
                          Giá trị: {selectedOrder.couponResponse.discountValue}
                          {selectedOrder.couponResponse.discountType ===
                          "PERCENTAGE"
                            ? "%"
                            : "đ"}
                        </p>
                        <p>
                          Hiệu lực:{" "}
                          {formatToVNDate(
                            selectedOrder.couponResponse.couponStartDate
                          )}{" "}
                          -{" "}
                          {formatToVNDate(
                            selectedOrder.couponResponse.couponEndDate
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="products-section">
                  <h3>Sản phẩm</h3>
                  <div className="products-table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Loại</th>
                          <th>Đơn giá</th>
                          <th>SL</th>
                          <th>Phí ship</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderItems
                          ? selectedOrder.orderItems.map((product) => {
                              const productInfo = getProductInfo(product);
                              return (
                                <tr key={product.id}>
                                  <td>
                                    <div className="product-info">
                                      <div className="product-name">
                                        {productInfo.name}
                                      </div>
                                      {productInfo.isCustomized && (
                                        <div className="customization-details">
                                          <span className="custom-badge">
                                            Tùy chỉnh
                                          </span>

                                          {productInfo.designInfo
                                            ?.imagePath && (
                                            <div className="design-preview">
                                              <img
                                                src={`http://localhost:8080${productInfo.designInfo.imagePath}`}
                                                alt="Design preview"
                                                className="design-thumbnail"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <span
                                      className={`product-type ${
                                        productInfo.isCustomized
                                          ? "customized"
                                          : "regular"
                                      }`}
                                    >
                                      {productInfo.isCustomized
                                        ? "Tùy chỉnh"
                                        : "Thường"}
                                    </span>
                                  </td>
                                  <td>{formatCurrency(productInfo.price)}</td>
                                  <td>{product.quantity}</td>
                                  <td>
                                    {formatCurrency(selectedOrder?.shippingFee)}
                                  </td>

                                  <td>
                                    {formatCurrency(
                                      productInfo.price * product.quantity +
                                        selectedOrder?.shippingFee
                                    )}
                                  </td>
                                </tr>
                              );
                            })
                          : selectedOrder.products &&
                            selectedOrder.products.map((product, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="product-info">
                                    <div className="product-name">
                                      {product.name}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="product-type regular">
                                    Thường
                                  </span>
                                </td>
                                <td>{formatCurrency(product.price)}</td>
                                <td>{product.quantity}</td>
                                <td>{selectedOrder?.shippingFee}</td>
                                <td>
                                  {formatCurrency(
                                    product.price * product.quantity +
                                      selectedOrder.shippingFee
                                  )}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="status-history">
                  <h3>Lịch sử trạng thái</h3>
                  <div className="timeline">
                    <div className="timeline-items">
                      {(selectedOrder.orderStatusHistories?.length > 0
                        ? selectedOrder.orderStatusHistories
                        : selectedOrder.statusHistory
                      )?.map((status, index) => (
                        <div key={index} className="timeline-item">
                          <div className="timeline-icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="status-text">
                              {statusTextMap[status.status]}
                            </p>
                            <p className="status-date">
                              {status.updatedAt
                                ? formatToVNDate(status.updatedAt)
                                : `${status.date} ${status.time}`}
                            </p>
                          </div>
                        </div>
                      ))}
                      {!selectedOrder.orderStatusHistories?.length &&
                        !selectedOrder.statusHistory?.length && (
                          <div className="timeline-item">
                            <div className="timeline-icon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="status-text">
                                {
                                  statusTextMap[
                                    selectedOrder.orderStatus ||
                                      selectedOrder.status
                                  ]
                                }
                              </p>
                              <p className="status-date">
                                {formatToVNDate(
                                  selectedOrder.createdAt ||
                                    selectedOrder.createDate
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p>Chọn một đơn hàng để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal cập nhật trạng thái */}
      {showStatusModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cập nhật trạng thái đơn hàng</h3>
            <div className="form-group">
              <label>Chọn trạng thái mới</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">-- Chọn trạng thái --</option>
                {statusOptions.map((option) => {
                  // Don't show current status in dropdown
                  if (
                    selectedOrder &&
                    statusTextMap[
                      selectedOrder.orderStatus || selectedOrder.status
                    ] === option
                  ) {
                    return null;
                  }
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="modal-actions">
              <button
                className="cancel"
                onClick={() => setShowStatusModal(false)}
              >
                Hủy
              </button>
              <button
                className="update"
                onClick={handleUpdateStatus}
                disabled={!newStatus}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
