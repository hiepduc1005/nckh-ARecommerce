import React from 'react'
import './ListFeaturesProduct.css'
import productTest from '../../assets/image/testproduct.jpg'
import arrowLeftIcon from '../../assets/icon/arrow-left.png'
import arrowRightIcon from '../../assets/icon/arrow-right.png'


const ListFeaturesProduct = () => {
  return (
    <div className='list-feature-product'>
      <div className='content'>SẢN PHẨM NỔI BẬT</div>
      <div className='list-products'>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
         <div className="product-feature-item">
            <div className="product-image">
              <img src={productTest}></img>
            </div>
            <div className="productname">Giày Thể Thao Nam Dệt Thoi Thời Trang Giày Chạy Bộ Thường Ngày Chịu Mài Mòn</div>
            <div className="others">
              <div className="product-price">75,421</div>
              <div className="product-selled">Đã bán 12</div>
            </div>
         </div>
      </div>
      <div className='arrow-left'>
        <img src={arrowLeftIcon}></img>
      </div>
      <div className='arrow-right'>
        <img src={arrowRightIcon}></img>
      </div>
    </div>
  )
}

export default ListFeaturesProduct