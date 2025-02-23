import React from 'react'
import '../assets/styles/components/ProductList.scss'

const products = new Array(6).fill({
    name: "TÊN SẢN PHẨM",
    price: "XXX.XXX đ",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600", // Thay bằng đường dẫn ảnh
  });
  
  const ProductList = () => {
    return (
      <div className="product-list">
        <h3>Có xx kết quả tìm kiếm phù hợp:</h3>
        <div className="products">
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="image-placeholder"></div>
              <h4>{product.name}</h4>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
export default ProductList