import React from 'react'
import "../assets/styles/components/ProductRecommend.scss"
import ReactStars from 'react-stars'
const ProductRecommend = ({products}) => {
  return (
    <div className='list-product'>
        {products && products.map((product) => {
            return (
                <div className="item" key={product.id}>
                    <img src={product.image} alt="" />
                    <div className="product-name">{product.name}</div>
                    <div className="ratings">
                       
                        <span className="rating-score">{product.rating.toFixed(1)}</span> {/* Điểm đánh giá */}
                        <span className="reviews">({product.reviews} đánh giá)</span>
                    </div>
                    <div className="product-price">
                        <div className="original">{product.originalPrice}</div>
                        <div className="sale">{product.discountedPrice}</div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}

export default ProductRecommend