import React, { useEffect, useState } from "react";
import "../assets/styles/pages/OrderManagement.scss";
import { toast } from "react-toastify";
import { getOrdersPaginate } from "../api/orderApi";
import useAuth from "../hooks/UseAuth";

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
  const [orders, setOrders] = useState([
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      products: [
        { name: "Áo thun", quantity: 2, price: 250000 },
        { name: "Quần jeans", quantity: 1, price: 450000 },
      ],
      status: OrderStatus.PROCESSING,
      createDate: "2025-04-10",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-10", time: "08:00" },
        { status: OrderStatus.PAID, date: "2025-04-10", time: "08:30" },
        { status: OrderStatus.PROCESSING, date: "2025-04-10", time: "10:15" },
      ],
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      address: "456 Lê Lợi, Quận 5, TP.HCM",
      products: [{ name: "Túi xách", quantity: 1, price: 850000 }],
      status: OrderStatus.SHIPPED,
      createDate: "2025-04-11",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-11", time: "09:00" },
        { status: OrderStatus.PAID, date: "2025-04-11", time: "09:45" },
        { status: OrderStatus.PROCESSING, date: "2025-04-11", time: "11:20" },
        { status: OrderStatus.SHIPPED, date: "2025-04-12", time: "08:00" },
      ],
    },
    {
      id: "DH003",
      customer: "Phạm Văn C",
      address: "789 Võ Văn Tần, Quận 3, TP.HCM",
      products: [
        { name: "Giày thể thao", quantity: 1, price: 1200000 },
        { name: "Tất", quantity: 3, price: 50000 },
      ],
      status: OrderStatus.PENDING,
      createDate: "2025-04-12",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-12", time: "07:15" },
      ],
    },
    {
      id: "DH004",
      customer: "Lê Thị D",
      address: "101 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
      products: [{ name: "Đồng hồ", quantity: 1, price: 2500000 }],
      status: OrderStatus.DELIVERED,
      createDate: "2025-04-08",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-08", time: "10:30" },
        { status: OrderStatus.PAID, date: "2025-04-08", time: "10:45" },
        { status: OrderStatus.PROCESSING, date: "2025-04-08", time: "14:20" },
        { status: OrderStatus.SHIPPED, date: "2025-04-09", time: "09:00" },
        { status: OrderStatus.DELIVERED, date: "2025-04-10", time: "15:30" },
      ],
    },
    {
      id: "DH005",
      customer: "Hoàng Văn E",
      address: "202 Nguyễn Văn Cừ, Quận 5, TP.HCM",
      products: [
        { name: "Laptop", quantity: 1, price: 18500000 },
        { name: "Chuột không dây", quantity: 1, price: 450000 },
      ],
      status: OrderStatus.CANCELLED,
      createDate: "2025-04-09",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-09", time: "11:15" },
        { status: OrderStatus.CANCELLED, date: "2025-04-09", time: "11:45" },
      ],
    },
    {
      id: "DH006",
      customer: "Ngô Thị F",
      address: "303 Cách Mạng Tháng 8, Quận 10, TP.HCM",
      products: [{ name: "Bàn phím", quantity: 1, price: 1200000 }],
      status: OrderStatus.REFUNDED,
      createDate: "2025-04-07",
      statusHistory: [
        { status: OrderStatus.PENDING, date: "2025-04-07", time: "08:30" },
        { status: OrderStatus.PAID, date: "2025-04-07", time: "08:45" },
        { status: OrderStatus.PROCESSING, date: "2025-04-07", time: "10:00" },
        { status: OrderStatus.SHIPPED, date: "2025-04-08", time: "08:15" },
        { status: OrderStatus.DELIVERED, date: "2025-04-09", time: "14:30" },
        { status: OrderStatus.REFUNDED, date: "2025-04-10", time: "09:45" },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [newStatus, setNewStatus] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordersPerPage] = useState(5);
  const { token } = useAuth();

  // Status options for filters and dropdowns
  const statusOptions = Object.values(OrderStatus).map(
    (status) => statusTextMap[status]
  );
  const filterOptions = ["Tất cả", ...statusOptions];

  const fetchOrder = async () => {
    const data = await getOrdersPaginate(token, currentPage);
    if (data) {
      setOrders(data.content);
      setTotalPages(data.totalPages);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [currentPage]);

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
        return [OrderStatus.PROCESSING, OrderStatus.REFUNDED].includes(next);
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

  // Filter orders by search term and status
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      statusFilter === "Tất cả" || statusTextMap[order.status] === statusFilter;

    return matchSearch && matchStatus;
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = () => {
    if (!newStatus || !selectedOrder) return;

    // Convert displayed status back to enum value
    const selectedStatusEnum = Object.keys(statusTextMap).find(
      (key) => statusTextMap[key] === newStatus
    );

    if (!isValidStatusTransition(selectedOrder.status, selectedStatusEnum)) {
      toast.error(
        `Không thể chuyển trạng thái từ ${
          statusTextMap[selectedOrder.status]
        } sang ${newStatus}`
      );
      return;
    }

    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        const updatedOrder = {
          ...order,
          status: selectedStatusEnum,
          statusHistory: [
            ...order.statusHistory,
            { status: selectedStatusEnum, date: dateStr, time: timeStr },
          ],
        };
        setSelectedOrder(updatedOrder);
        return updatedOrder;
      }
      return order;
    });

    setOrders(updatedOrders);
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

  return (
    <div className="order-tracking-page">
      <div className="container">
        <h1>Quản Lý Đơn Hàng</h1>

        <div className="content-wrapper">
          {/* Danh sách đơn hàng */}
          <div className="orders-list">
            <div className="search-controls">
              <div className="search-form">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc khách hàng"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="orders-container">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`order-item ${
                      selectedOrder?.id === order.id ? "selected" : ""
                    }`}
                    onClick={() => handleOrderSelect(order)}
                  >
                    <div className="header">
                      <span className="order-id">{order.code}</span>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {statusTextMap[order.orderStatus]}
                      </span>
                    </div>
                    <div className="customer-name">{order.email}</div>
                    <div className="order-date">{order.createdAt}</div>
                  </div>
                ))
              ) : (
                <div className="no-orders">Không tìm thấy đơn hàng nào</div>
              )}
            </div>

            {/* Pagination controls */}
            {filteredOrders.length > 0 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  &laquo;
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`pagination-button ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  &raquo;
                </button>
              </div>
            )}
          </div>

          {/* Chi tiết đơn hàng */}
          <div className="order-details">
            {selectedOrder ? (
              <div>
                <div className="header">
                  <h2>Chi tiết đơn hàng #{selectedOrder.code}</h2>
                  <button onClick={() => setShowStatusModal(true)}>
                    Cập nhật trạng thái
                  </button>
                </div>

                <div className="customer-info-grid">
                  <div className="info-block">
                    <h3>Thông tin khách hàng</h3>
                    <p>{selectedOrder.email}</p>
                    <p className="address">{selectedOrder.address}</p>
                  </div>
                  <div className="info-block">
                    <h3>Thông tin đơn hàng</h3>
                    <p>Ngày tạo: {selectedOrder.createdAt}</p>
                    <p>
                      Trạng thái:
                      <span
                        className={`status-badge ${getStatusClass(
                          selectedOrder.orderStatus
                        )}`}
                      >
                        {statusTextMap[selectedOrder.orderStatus]}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="products-section">
                  <h3>Sản phẩm</h3>
                  <div className="products-table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Đơn giá</th>
                          <th>SL</th>
                          <th>Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.orderItems.map((product, index) => (
                          <tr key={product.id}>
                            <td>
                              {
                                product.variantResponse.productResponse
                                  .productName
                              }
                            </td>
                            <td>
                              {formatCurrency(
                                product.variantResponse.discountPrice
                                  ? product.variantResponse.discountPrice
                                  : product.variantResponse.price
                              )}
                            </td>
                            <td>{product.quantity}</td>
                            <td>
                              {formatCurrency(
                                (product.variantResponse.discountPrice
                                  ? product.variantResponse.discountPrice
                                  : product.variantResponse.price) *
                                  product.quantity
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3">Tổng cộng:</td>
                          <td>
                            {formatCurrency(
                              calculateTotal(selectedOrder.orderItems)
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                <div className="status-history">
                  <h3>Lịch sử trạng thái</h3>
                  <div className="timeline">
                    <div className="timeline-items">
                      {selectedOrder.statusHistory.map((status, index) => (
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
                              {status.date} {status.time}
                            </p>
                          </div>
                        </div>
                      ))}
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
                    statusTextMap[selectedOrder.status] === option
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
