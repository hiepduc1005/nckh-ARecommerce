import React, { useState } from 'react';
import '../assets/styles/pages/Checkout.scss';
import { 
  DollarSign,  // For COD
  PhoneOutgoing,  // For MOMO
  CreditCard as StripeIcon,
  ShieldCheck  // For VNPAY
} from 'lucide-react';
import { useEffect } from 'react';
import useQuery from '../hooks/useQuery';
import { decryptData, isValidEmail, isValidPhoneNum } from '../utils/ultils';
import { getVariantsById, getVariantsByIds } from '../api/variantApi';
import useAuth from '../hooks/UseAuth';
import SelectPlace from '../components/SelectPlace';
import { toast } from 'react-toastify';
import { createPayment } from '../api/paymentApi';

const Checkout = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [reciveEmail,setReciveEmail] = useState(false)
    const [specificAddress, setSpecificAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cartItems,setCartItems] = useState([]);
    const [phone,setPhone] = useState("");
    const [customerNote, setCustomerNote] = useState('');

    const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.discountPrice * item.quantity), 0);
    const total = subtotal + 4.99; // Adding shipping
    const {user} = useAuth();
    const query = useQuery();
    const encrd = query.get("encrd")

    useEffect(() => {
      if (!encrd) return;
      const decryptedData = decryptData(decodeURIComponent(encrd));
      const handleFetchVariant = async () => {
        const listIds = decryptedData.map(dataItem => (dataItem.variant))
        const data = await getVariantsByIds(listIds);
        if(data){
          const newCartItems = decryptedData.map(({ quantity, variant }) => {
            const variantResponse = data.find(v => v.id === variant); // Tìm variantResponse theo id
            return { quantity, variant : variantResponse };
          })
          setCartItems(newCartItems);
        }
      }
      handleFetchVariant();
    },[encrd])

    useEffect(() => {
      if (user) {
        setEmail(user.email || '');
        setFirstName(user.firstname || '');
        setLastName(user.lastname || '');
    
        const defaultAddress = user.addressResponses?.find(address => address.isDefault);
        setAddress(defaultAddress?.address || '');
        setSpecificAddress(defaultAddress?.specificAddress || '');
        setPhone(defaultAddress?.phone || '');

      }
    }, [user]);

    const handleSubmit = async () => {
      if(!isValidPhoneNum(phone)){
        toast.error("Số điện thoại không hợp lệ!")
        return;
      }

      if(!isValidEmail(email)){
        toast.error("Email không hợp lệ!")
        return;
      }
      const orderItems = cartItems.map(cartItem => (
        {
          quantity: cartItem.quantity,
          variantId: cartItem.variant.id
        }
      ))
      const orderData = {
        email,
        couponCode: "",
        address: specificAddress,
        specificAddress: specificAddress,
        paymentMethod: paymentMethod,
        notes: customerNote || "",
        orderItemCreateRequests:  orderItems,
        phone,
      }

      const paymentURL = await createPayment(orderData);
      if(paymentURL){
        window.location.href = paymentURL;
      }

      console.log(orderData)
    }
  
    const paymentMethods = [
        {
            id: 'COD',
            name: 'Thanh toán khi nhận hàng',
            icon: <DollarSign />,
            className: 'cod-payment'
        },
        {
            id: 'VNPAY',
            name: 'VNPAY',
            icon: <ShieldCheck />,
            className: 'vnpay-payment'
        },
        {
            id: 'MOMO',
            name: 'Ví MOMO',
            icon: <PhoneOutgoing />,
            className: 'momo-payment'
        },
        {
            id: 'STRIPE',
            name: 'Stripe',
            icon: <StripeIcon />,
            className: 'stripe-payment'
        }
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
              <label style={{display: "flex",justifyContent: "flex-start", gap: "16px"}}>
                <span>Nhận tin khuyến mãi và các sản phẩm mới qua email</span>
                <input 
                  style={{width: "auto"}} 
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
                <SelectPlace defaultValue={specificAddress} onChange={setSpecificAddress}/> 
               
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
                      src={`http://localhost:8080${item?.variant?.imagePath}` || `http://localhost:8080${item?.variant?.productResponse?.imagePath}`} 
                      alt={item?.variant?.productResponse?.productName} 
                      className="product-thumbnail"
                    />
                  </div>
                  <div className="item-details">
                    <span className='name'>
                      {item?.variant?.productResponse?.productName}
                    </span>
                    <div className="item-attributes">
                      <span className="attribute">
                        Loại: {item?.variant?.attributeValueResponses?.map(attr => attr.attributeValue).join(", ")}
                      </span>
                    </div>
                    <span className='quantity'>x{item.quantity}</span>
                  </div>
                  <span className='price'>
                    ${item?.variant?.discountPrice ? 
                      (item?.variant?.discountPrice).toFixed(2) : 
                      (item?.variant?.price).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="cart-totals">
                <div className="subtotal">
                  <span>Tổng phụ</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="shipping">
                  <span>Phí vận chuyển</span>
                  <span>$4.99</span>
                </div>
                <div className="total">
                  <span>Tổng cộng</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="payment-options">
              <h2>Chọn phương thức thanh toán</h2>
              <div className="payment-buttons">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`payment-method ${method.className} ${paymentMethod === method.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    {method.icon}
                    {method.name}
                  </button>
                ))}
              </div>
              
            {paymentMethod === 'STRIPE' && (
                <div className="payment-method-details">
                    <div className="stripe-details">
                      <p>Thanh toán bằng thẻ quốc tế qua Stripe</p>
                      <input 
                        type="text" 
                        placeholder="Số thẻ" 
                      />
                      <div className="card-details">
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                        />
                        <input 
                          type="text" 
                          placeholder="CVV" 
                        />
                      </div>
                    </div>
                
                </div>
              )}
              
              <input 
                type="text" 
                placeholder="Mã giảm giá" 
              />
              <button className="apply-code">Áp dụng</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default Checkout;