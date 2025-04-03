import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/pages/AdminOrder.scss';
import useAuth from '../hooks/UseAuth';
import { getOrdersPaginate } from '../api/orderApi';
import useLoading from '../hooks/UseLoading';
import { formatCurrency, formatToVNDate } from '../utils/ultils';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  
  const { loading } = useLoading();
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrdersPaginate(token, currentPage);

      if(data){
        setOrders(data.content);
        setTotalPages(data.totalPages);
      }
    }
  
    fetchOrders();
  }, [currentPage, token]);

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'ALL' || order.orderStatus === filterStatus;
    const matchesSearch = 
      order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-badge status-pending';
      case 'PAID': return 'status-badge status-paid';
      case 'PROCESSING': return 'status-badge status-processing';
      case 'SHIPPED': return 'status-badge status-shipped';
      case 'DELIVERED': return 'status-badge status-delivered';
      case 'CANCELLED': return 'status-badge status-cancelled';
      case 'REFUNDED': return 'status-badge status-refunded';
      default: return 'status-badge';
    }
  };

  // Get status text (for display)
  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pending';
      case 'PAID': return 'Paid';
      case 'PROCESSING': return 'Processing';
      case 'SHIPPED': return 'Shipped';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      case 'REFUNDED': return 'Refunded';
      default: return status;
    }
  };

  // Navigate to order details page
  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
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
        <h2>Orders ({filteredOrders.length})</h2>
        
        {loading ? (
          <div className="loading-indicator">Loading orders...</div>
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
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.code}</td>
                      <td>{formatToVNDate(order.createdAt)}</td>
                      <td>
                        <div>{order.email}</div>
                        <div className="phone-number">{order.phone}</div>
                      </td>
                      <td className="price-cell">
                        {formatCurrency(order.totalPrice - order.discountPrice + order.shippingFee)}
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(order.orderStatus)}>
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
            <div className="pagination">
              <button 
                className="prev-btn" 
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button 
                    key={index} 
                    className={`page-number ${currentPage === (index + 1) ? 'active' : ''}`}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="next-btn" 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrder;