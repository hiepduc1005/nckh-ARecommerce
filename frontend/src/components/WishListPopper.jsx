import React from 'react'
import "../assets/styles/components/WishList.scss"
const WishListPopper = ({isWishListOpen,wishList}) => {
    return (
    <div className={`wishlist-popper ${!isWishListOpen ? "hidden" : ""}`}>
      <div className="wishlist-header">Sản Phẩm trong WishList</div>
      <div className="wishlist-content">
        {wishList?.length > 0 ? (
          wishList?.map((item, index) => (
            <div key={index} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-image" />
              <div className="wishlist-details">
                <div style={{display: "flex" , flexDirection: "column"}}>
                    <span className="wishlist-name">{item.name}</span>
                    <span className="wishlist-price">₫{item.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='empty-wishlist-message'>Không có sản phẩm WishList</p>
        )}
      </div>
      <button className="wishlist-button">Xem WishList</button>
    </div>
  )
}

export default WishListPopper