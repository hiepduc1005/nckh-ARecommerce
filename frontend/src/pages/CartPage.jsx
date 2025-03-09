import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash} from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/pages/CartPage.scss"
import { getCartByUserId } from '../api/cartApi';
import useAuth from '../hooks/UseAuth';
import useLoading from '../hooks/UseLoading';
import useCart from '../hooks/UseCart';
import emptyCart from "../assets/images/empty-cart.jpg"
import { Link } from 'react-router-dom';
const options = [
  { value: "time", label: "Thời gian" },
  { value: "price", label: "Giá" },
  { value: "name", label: "Tên" },
  { value: "rating", label: "Đánh giá" }
]

 {/* <div className="options">
            <div className="left">
              <input type="checkbox" />
              <span>Chọn tất cả</span>
            </div>
            <div className="right">
              <span>Sắp xếp theo:</span>
              <div className="select-container">
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue=""
                  placeholder="Sắp xếp"
                  isDisabled={false}
                  isLoading={false}
                  isClearable={true}
                  isRtl={false}
                  isSearchable={false}
                  name="sort"
                  options={options}
                />
              </div>
            </div>
          </div> */}
          


const CartPage = () => {
  const [cartItems,setCartItems] = useState();
  const [quantity,setQuantity] = useState();

  const {cart, removeItem , clearCart} = useCart();
  
  return (
    <div className='cart-container'>
        <div className="cart-background-image">
            <span>Giỏ hàng</span>
        </div>
        <div className="cart-body">
         
          { cart ? 
          
            <>
              <div className="cart-list">
                <div className="cart-button">
                  <button className='update'>Update Cart</button>
                  <button className='clear'>Clear Cart</button>
                </div>

                {cart?.cartItemResponses?.map(cartItem => (
                    <div className="cart-item">
                      <div className="left">
                        <FontAwesomeIcon onClick={() => removeItem(cartItem?.id)} icon={faTrash} className='trash-icon'/>
                      </div>
                      <div className="right">
                        <div className="img-container">
                          <img src="	http://localhost:8080/uploads/510ca92a-3638-4e8f-bb12-06b1cc4ebdcd_giaoducqp.jpg" alt="" />
                        </div>
                        <div className="product-cart-info">
                          <div className="product-name">{cartItem?.variantResponse?.productResponse?.productName}</div>
                          <div className="product-price">
                            <div className="discount">{cartItem?.variantResponse?.discountPrice}</div>
                            <div className="original">{cartItem?.variantResponse?.price}</div>
                          </div>
                          <div className="list-variant">
                            {cartItem?.variantResponse?.attributeResponses?.map((attribute , index) => (
                              <div className="item">
                                <div className="name">{attribute?.attributeName}</div>
                                <div className="value">{cartItem?.variantResponse?.attributeValueResponses[index]}</div>
                              </div>
                            ))}
                          
                          </div>
                          <div className="quantity">
                            <span>So luong:</span>
                            <div className="button">
                              <button className="ex">
                                <FontAwesomeIcon icon={faMinus} />
                              </button>
                              <div className="value">{cartItem?.quantity}</div>
                              <button className="plus">
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
                  <div className="title">Nhap voucher:</div>
                  <div className="voucher-input">
                    <input type="text" />
                    <button>Ap dung</button>
                  </div>
                </div>
                <div className="cart-total">
                  <div className="value"> <span>Tong: </span>{cart?.totalPrice} Đ</div>              
                <button className="order">Thanh toan ngay</button>
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