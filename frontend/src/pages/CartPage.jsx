import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash} from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/pages/CartPage.scss"
import { getCartByUserId } from '../api/cartApi';
import useAuth from '../hooks/UseAuth';
import useLoading from '../hooks/UseLoading';
import useCart from '../hooks/UseCart';
import emptyCart from "../assets/images/empty-cart.jpg"
import { Link, useNavigate } from 'react-router-dom';
import { encryptData } from '../utils/ultils';

const CartPage = () => {
  const [quantity, setQuantity] = useState({});
  const { cart, removeItem, addItem, clearCart, updateQuantity } = useCart();

  const navigate = useNavigate();
  const handleQuantityChange = (variantId, newQuantity) => {
    if (newQuantity > 0) {
      setQuantity(prev => ({
        ...prev,
        [variantId]: newQuantity
      }));
      // updateQuantity(cartItemId, newQuantity);
    }
  };

  useEffect(() => {
    if(cart){
      const newQuantities = {};
      cart.cartItemResponses.forEach(cartItem => {
        newQuantities[cartItem.variantResponse.id] = cartItem.quantity;
      });
      setQuantity(newQuantities);
    }

    console.log(quantity)
  },[cart])


  const handleClearCart = async () => {
    await clearCart();
  };

  const handleUpdateCart = () => {
    if(cart){
      // cart.cartItemResponses?
    }
  };

  const handleCheckOut = () => {
    const data = cart.cartItemResponses.map(cartItem => (
      {
        quantity: cartItem.quantity,
        variant: cartItem.variantResponse.id,
        cartItemId: cartItem.id,
      }
    ))

    const encryptedData = encryptData(data);
    const encodedData = encodeURIComponent(encryptedData);

    navigate(`/checkout?encrd=${encodedData}`)
  }

  return (
    <div className='cart-container'>
        <div className="cart-background-image">
            <span>Giỏ hàng</span>
        </div>
        <div className="cart-body">
          { cart && cart.cartItemResponses && cart.cartItemResponses.length > 0 ? 
            <>
              <div className="cart-list">
                <div className="cart-buttons">
                  <button className='update' onClick={handleUpdateCart}>Update Cart</button>
                  <button className='clear' onClick={handleClearCart}>Clear Cart</button>
                </div>

                {cart.cartItemResponses.map(cartItem => (
                    <div className="cart-item" key={cartItem.id}>
                      <div className="left">
                        <FontAwesomeIcon onClick={() => removeItem(cartItem.id)} icon={faTrash} className='trash-icon'/>
                      </div>
                      <div className="right">
                        <div className="img-container">
                          <img src={`http://localhost:8080${cartItem.variantResponse?.imagePath}` || "http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg"} alt="Product" />
                        </div>
                        <div className="product-cart-info">
                          <div className="product-name">{cartItem.variantResponse?.productResponse?.productName}</div>
                          <div className="product-price">
                            <div className="discount">{cartItem.variantResponse?.discountPrice.toLocaleString()} Đ</div>
                            <div className="original">{cartItem.variantResponse?.price.toLocaleString()} Đ</div>
                          </div>
                          <div className="list-variant">
                            {cartItem.variantResponse?.attributeResponses?.map((attribute, index) => (
                              <div className="item" key={attribute.id || index}>
                                <div className="name">{attribute.attributeName}:</div>
                                <div className="value">{cartItem.variantResponse?.attributeValueResponses[index]}</div>
                              </div>
                            ))}
                          </div>
                          <div className="quantity">
                            <span>Số lượng:</span>
                            <div className="button">
                              <button className="ex" onClick={() => handleQuantityChange(cartItem.variantResponse.id, quantity[cartItem.variantResponse.id] - 1)}>
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                              <div className="value">{quantity[cartItem.variantResponse.id] || cartItem.quantity}</div>
                              <button className="plus" onClick={() => handleQuantityChange(cartItem.variantResponse.id, quantity[cartItem.variantResponse.id] + 1)}>
                                <FontAwesomeIcon icon={faPlus}/>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
              <div className="total">
                <div className="voucher">
                  <div className="title">Nhập voucher:</div>
                  <div className="voucher-input">
                    <input type="text" placeholder="Mã giảm giá" />
                    <button>Áp dụng</button>
                  </div>
                </div>
                <div className="cart-total">
                  <div className="value"><span>Tổng: </span>{cart.totalPrice?.toLocaleString()} Đ</div>              
                  <button className="order" onClick={() => handleCheckOut()}>Thanh toán ngay</button>
                </div>
              </div>
            </>
            : 
            <div className="empty-cart">
              <img src={emptyCart} alt="Giỏ hàng trống" />
              <p>Giỏ hàng của bạn đang trống. Hãy mua sắm ngay!</p>
              <Link to={"/"} className="shop-now">Mua sắm ngay</Link>
            </div>
          }
        </div>
    </div>
  )
}

export default CartPage