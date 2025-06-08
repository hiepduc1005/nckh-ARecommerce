import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/AdminOrder.scss";
import useAuth from "../hooks/UseAuth";
import { getOrdersPaginate } from "../api/orderApi";
import useLoading from "../hooks/UseLoading";
import { formatCurrency, formatToVNDate } from "../utils/ultils";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const { setLoading, loading } = useLoading();
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getOrdersPaginate(token, currentPage);

      if (data) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [currentPage, token]);

  // Filter orders based on status and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "ALL" || order.orderStatus === filterStatus;
    const matchesSearch =
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-badge status-pending";
      case "PAID":
        return "status-badge status-paid";
      case "PROCESSING":
        return "status-badge status-processing";
      case "SHIPPED":
        return "status-badge status-shipped";
      case "DELIVERED":
        return "status-badge status-delivered";
      case "CANCELLED":
        return "status-badge status-cancelled";
      case "REFUNDED":
        return "status-badge status-refunded";
      default:
        return "status-badge";
    }
  };

  // Get status text (for display)
  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PAID":
        return "Paid";
      case "PROCESSING":
        return "Processing";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      case "REFUNDED":
        return "Refunded";
      default:
        return status;
    }
  };

  // Navigate to order details page
  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  // Generate pagination numbers with ellipsis
  const generatePaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-order-container">
      <h1>Order Management</h1>

      <div className="order-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by order code, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <label>Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="ALL">All Orders</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      <div className="orders-list-container">
        <h2>Orders</h2>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">No orders found matching the criteria</div>
        ) : (
          <>
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order Code</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.code}</td>
                      <td>{formatToVNDate(order.createdAt)}</td>
                      <td>
                        <div>{order.email}</div>
                        <div className="phone-number">{order.phone}</div>
                      </td>
                      <td className="price-cell">
                        {formatCurrency(
                          order.totalPrice -
                            order.discountPrice +
                            order.shippingFee
                        )}
                      </td>
                      <td>
                        <span
                          className={getStatusBadgeClass(order.orderStatus)}
                        >
                          {getStatusText(order.orderStatus)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => handleViewOrder(order.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn prev-btn"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  <span>‹</span>
                  Previous
                </button>

                <div className="page-numbers">
                  {generatePaginationNumbers().map((page, index) => (
                    <button
                      key={index}
                      className={`page-number ${
                        page === currentPage ? "active" : ""
                      } ${page === "..." ? "ellipsis" : ""}`}
                      onClick={() => handlePageClick(page)}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn next-btn"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <span>›</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;
