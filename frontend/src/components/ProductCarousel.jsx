import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import "../assets/styles/components/ProductCarousel.scss";
import nextIcon from "../assets/icons/next-icon.png"
import prevIcon from "../assets/icons/prev-icon.png"
import ReactStars from 'react-stars'

// const products = [
//   { id: 1, name: "TÊN SẢN PHẨM", price: "XXX.XXX đ", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//   { id: 2, name: "TÊN SẢN PHẨM", price: "XXX.XXX đ", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//   { id: 3, name: "TÊN SẢN PHẨM", price: "XXX.XXX đ", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//   { id: 4, name: "TÊN SẢN PHẨM", price: "XXX.XXX đ", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//   { id: 5, name: "TÊN SẢN PHẨM", price: "XXX.XXX đ", image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
// ];

const ProductCarousel = ({ category ,revertBanner ,products}) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị 3 sản phẩm trên 1 lần cuộn
    slidesToScroll: 1,
    swipeToSlide: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="carousel-container" style={revertBanner ? { flexDirection: "row-reverse" } : {}}>
    {/* Hình ảnh bên trái */}
      <div className="category-banner">
        <img src={category.image} alt={category.title} />
        <div className="overlay">
          <h2>{category.title}</h2>
          <p>{category.description}</p>
          <button className="view-more">Xem Thêm</button>
        </div>
      </div>

      {/* Slider sản phẩm */}
      <div className="product-carousel">
        <Slider {...settings}>
          {products?.map((product) => (
            <div key={product.id} className="product-item" style={{width: "auto", marginRight: "12px"}}>
              <img src={`http://localhost:8080${product.imagePath}`} alt={product.productName} />
              <div className="product-body">
                <div className="product-name">{product.productName}</div>
                <div className="product-price">{product.price}</div>
                <div className="product-rating">
                  <ReactStars
                      count={5}
                      value={product.ratingValue}
                      size={18}
                      color2={"#f8b400"} 
                      edit={false}
                      half={true}
                      style={{ display: 'flex', alignItems: 'center' }} // Căn chỉnh sao
                  />
                      <span className="rating-score">{product.ratingValue.toFixed(1)}</span> {/* Điểm đánh giá */}
                      <span className="reviews">({product.ratingResponses.length} lượt đánh giá)</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

// Nút next
export const SampleNextArrow = (props) => {
  const { className, onClick } = props;
  return <img src={nextIcon} className={`${className} slick-arrow next`} onClick={onClick} />;
};

// Nút prev
export const SamplePrevArrow = (props) => {
  const { className, onClick } = props;
  return <img src={prevIcon} className={`${className} slick-arrow prev`} onClick={onClick} />;
};

export default ProductCarousel;
