import React from 'react'
import "../assets/styles/components/CartPopper.scss"
const CartPopper = ({isCartOpen,cart}) => {

    return (
    <div className={`cart-popper ${!isCartOpen ? "hidden" : ""}`}>
      <div className="cart-header">Sản Phẩm Mới Thêm</div>
      <div className="cart-content">
        {cart?.length > 0 ? (
          cart?.map((item, index) => (
            <div key={index} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <div style={{display: "flex" , flexDirection: "column"}}>
                    <span className="cart-name">{item.name}</span>
                    <span className="cart-price">₫{item.price.toLocaleString()}</span>
                </div>
                <span className='cart-quantity'>x3</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-cart-message" >Không có sản phẩm trong giỏ</p>
        )}
      </div>
      <button className="cart-button">Xem Giỏ Hàng</button>
    </div>
  )
}

export default CartPopper