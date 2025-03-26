import React, { useState } from 'react';
import '../assets/styles/pages/Checkout.scss';
import { 
  ChevronRight, 
  CreditCard, 
  MapPin, 
  ShoppingCart, 
  DollarSign,  // For COD
  PhoneOutgoing,  // For MOMO
  CreditCard as StripeIcon,
  ShieldCheck  // For VNPAY
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useQuery from '../hooks/useQuery';
import { decryptData } from '../utils/ultils';
import { getVariantsById, getVariantsByIds } from '../api/variantApi';

const Checkout = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [cartItems,setCartItems] = useState([]);
  
    const subtotal = cartItems.reduce((sum, item) => sum + item.discountPrice, 0);
    const total = subtotal + 4.99; // Adding shipping
    
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
          console.log(JSON.stringify(newCartItems))

          setCartItems(newCartItems);
        }
      }
      handleFetchVariant();
    },[encrd])
  
    const paymentMethods = [
        {
            id: 'cod',
            name: 'Thanh toán khi nhận hàng',
            icon: <DollarSign />,
            className: 'cod-payment'
        },
        {
            id: 'vnpay',
            name: 'VNPAY',
            icon: <ShieldCheck />,
            className: 'vnpay-payment'
        },
        {
            id: 'momo',
            name: 'Ví MOMO',
            icon: <PhoneOutgoing />,
            className: 'momo-payment'
        },
        {
            id: 'stripe',
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
              <div className="checkout-steps">
                <span className="active">Giỏ hàng</span>
                <ChevronRight />
                <span className="active">Thông tin</span>
                <ChevronRight />
                <span>Thanh toán</span>
              </div>
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
                <input style={{width: "auto"}} type="checkbox" />
              </label>
            </div>
  
            
  
            <div className="shipping-section">
              <h2>Địa chỉ giao hàng</h2>
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
              <input 
                type="text" 
                placeholder="Địa chỉ" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="location-inputs">
                <input 
                  type="text" 
                  placeholder="Thành phố" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  <option value="HN">Hà Nội</option>
                  <option value="HCM">Hồ Chí Minh</option>
                  <option value="DN">Đà Nẵng</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Mã ZIP" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>
  
            <button className="continue-button">
              Tiếp tục thanh toán
            </button>
          </div>
  
          <div className="checkout-right">
            <div className="cart-summary">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <span>{item?.variant?.productResponse?.productName}</span>
                  <span>${item?.variant?.discountPrice ? item?.variant?.discountPrice : item?.variant?.price}</span>
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
              
            {paymentMethod === 'stripe' && (
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