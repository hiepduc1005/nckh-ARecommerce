import React from "react";
import "../assets/styles/components/ProductRecommend.scss";
import ReactStars from "react-stars";
import { useNavigate } from "react-router-dom";

const ProductRecommend = ({ products }) => {
  const navigate = useNavigate();
  return (
    <div className="list-product">
      {products &&
        products.map((product) => {
          return (
            <div
              className="item"
              key={product.id}
              onClick={() => navigate(`/products/${product?.slug}`)}
            >
              <img
                src={`http://localhost:8080${product.imagePath}`}
                alt={product.productName}
              />
              <div className="product-name">{product.productName}</div>
              <div className="ratings">
                <ReactStars
                  count={5}
                  value={product.ratingValue || 0}
                  size={16}
                  color2={"#ffd700"}
                  edit={false}
                />
                <span className="rating-score">
                  {(product.ratingValue || 0).toFixed(1)}
                </span>
                <span className="reviews">
                  ({product.ratingResponses?.length || 0} đánh giá)
                </span>
              </div>
              <div className="product-price">
                {product.minPrice !== product.maxPrice ? (
                  // Trường hợp có nhiều variant với giá khác nhau
                  <div className="price-range">
                    <span className="min-price">
                      {product.minPrice?.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="separator"> - </span>
                    <span className="max-price">
                      {product.maxPrice?.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                ) : (
                  // Trường hợp chỉ có một giá
                  <div className="single-price">
                    <span className="price">
                      {product.minPrice?.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                )}
              </div>
              <div className="product-meta">
                <span className="stock">Còn {product.stock} sản phẩm</span>
                <span className="sold">Đã bán {product.solded}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ProductRecommend;
