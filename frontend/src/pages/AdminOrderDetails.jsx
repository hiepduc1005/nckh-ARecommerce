import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/pages/AdminOrderDetail.scss';
import { format } from 'date-fns';
import { getOrderById } from '../api/orderApi';
import useLoading from '../hooks/UseLoading';
import { formatCurrency, formatToVNDate } from '../utils/ultils';

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const {loading,setLoading} = useLoading();

  useEffect(() => {
    const fetchOrder = async () => {
      const data = await getOrderById(orderId);

      if(data){
        setOrder(data);  
      }
    } 
    
    if(orderId){
      setLoading(true)
      fetchOrder()
    }
    setLoading(false)
  }, [orderId]);


  // Handle order status change
  const handleStatusChange = (newStatus) => {
    // In a real application, you would call your API to update the status
    // Example: fetch(`/api/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    
    setOrder(prev => ({ ...prev, orderStatus: newStatus }));
  };

  
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

  // Get payment method name
  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'MOMO': return 'MoMo';
      case 'BANK_TRANSFER': return 'Bank Transfer';
      case 'COD': return 'Cash On Delivery';
      case 'VNPAY': return 'VNPay';
      default: return method;
    }
  };

  if (loading) {
    return <div className="loading-container">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="not-found-container">
        <h2>Order Not Found</h2>
        <p>The order you are looking for does not exist or you don't have permission to view it.</p>
        <button className="back-button" onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/admin/orders')}>
          ← Back to Orders
        </button>
        <h1>Order Details: {order.code}</h1>
      </div>

      <div className="order-status-bar">
        <span className={getStatusBadgeClass(order.orderStatus)}>
          {order.orderStatus}
        </span>
        
        <div className="order-actions">
          {order.orderStatus === 'PENDING' && (
            <>
              <button 
                className="action-button approve"
                onClick={() => handleStatusChange('PROCESSING')}
              >
                Approve Order
              </button>
              <button 
                className="action-button cancel"
                onClick={() => handleStatusChange('CANCELLED')}
              >
                Cancel Order
              </button>
            </>
          )}
          {order.orderStatus === 'PROCESSING' && (
            <button 
              className="action-button ship"
              onClick={() => handleStatusChange('SHIPPED')}
            >
              Mark as Shipped
            </button>
          )}
          {order.orderStatus === 'SHIPPED' && (
            <button 
              className="action-button complete"
              onClick={() => handleStatusChange('COMPLETED')}
            >
              Mark as Completed
            </button>
          )}
          <button className="action-button print">Print Invoice</button>
        </div>
      </div>

      <div className="order-sections">
        <div className="order-section-grid">
          <div className="order-section">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Order Code:</span>
                <span className="info-value">{order.code}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">{formatToVNDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Approved:</span>
                <span className="info-value">{formatToVNDate(order.orderApprovedAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expires:</span>
                <span className="info-value">{formatToVNDate(order.orderExpireAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Payment Method:</span>
                <span className="info-value">{getPaymentMethodName(order.paymentMethod)}</span>
              </div>
              {order.paymentUrl && (
                <div className="info-item">
                  <span className="info-label">Payment URL:</span>
                  <a href={order.paymentUrl} target="_blank" rel="noopener noreferrer" className="payment-link">
                    Open Payment Link
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="order-section">
            <h3>Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{order.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{order.phone}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Address:</span>
                <span className="info-value">{order.address}</span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Detailed Address:</span>
                <span className="info-value">{order.specificAddress}</span>
              </div>
              {order.notes && (
                <div className="info-item full-width">
                  <span className="info-label">Notes:</span>
                  <span className="info-value">{order.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-section">
        <h3>Order Items</h3>
        <table className="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant Details</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.orderItems.map(item => {
              const originalPrice = item.variantResponse.price;
              const discountPrice = item.discountPrice || 0;
              const finalPrice = originalPrice - discountPrice;
              const totalPrice = finalPrice * item.quantity;
              
              return (
                <tr key={item.id}>
                  <td className="product-cell">
                    <div className="product-info">
                      <img 
                        src={`http://localhost:8080${item.variantResponse.imagePath}`} 
                        alt={item.variantResponse.productResponse.productName} 
                        className="product-image" 
                      />
                      <span style={{width: "200px", whiteSpace:"normal"}}>{item.variantResponse.productResponse.productName}</span>
                    </div>
                  </td>
                  <td className="variant-details">
                    {item.variantResponse.attributeValueResponses && 
                      item.variantResponse.attributeValueResponses.map((attr, index) => (
                        <div key={attr.id} className="variant-attribute">
                          <span className="attribute-name">{attr.attributeName}:</span>
                          <span className="attribute-value">{attr.attributeValue}</span>
                          {index < item.variantResponse.attributeValueResponses.length - 1 && ", "}
                        </div>
                      ))
                    }
                  </td>
                  <td className="price-cell">
                    {discountPrice > 0 ? (
                      <div className="price-with-discount">
                        <span className="original-price">{formatCurrency(originalPrice)}</span>
                        <span className="discount-price">{formatCurrency(finalPrice)}</span>
                        <span className="discount-badge">-{Math.round((discountPrice / originalPrice) * 100)}%</span>
                      </div>
                    ) : (
                      formatCurrency(originalPrice)
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td className="total-price">{formatCurrency(totalPrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        <div className="order-section">
          <h3>Payment Summary</h3>
          <div className="payment-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
            {order.couponResponse && (
              <div className="summary-row discount">
                <span>Discount ({order.couponResponse.code} - {order.couponResponse.discountPercent}%):</span>
                <span>-{formatCurrency(order.discountPrice)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatCurrency(order.totalPrice - order.discountPrice + order.shippingFee)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminOrderDetails