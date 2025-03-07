import React from 'react'
import '../assets/styles/components/SaleProductCarousel.scss'
import Slider from 'react-slick'
import { SampleNextArrow, SamplePrevArrow } from './ProductCarousel';
import ReactStars from 'react-stars'

// const products = [
//     { id: 1, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.5, reviews: 120, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//     { id: 2, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.1, reviews: 32, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//     { id: 3, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//     { id: 4, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 2.0, reviews: 42, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//     { id: 5, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 3.5, reviews: 21, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
//   ];
  

const SaleProductCarousel = ({products}) => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5, // Hiển thị 3 sản phẩm trên 1 lần cuộn
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
    <div className="saleproduct-carousel">
        <div className="title">CÁC SẢN PHẨM ĐANG GIẢM GIÁ</div>
        <div className="carousel">
            <Slider {...settings}>
                {products?.map((product) => (
                    <div key={product.id} className="product-item" >
                        <img src={`http://localhost:8080${product.imagePath}`} alt={product.productName} />
                        <div className="product-body">

                            <div className="product-name">{product.productName}</div>
                            
                            {/* Giá sản phẩm */}
                            <div className="product-prices">
                                <span className="original-price">{product.price} </span>
                                <span className="discounted-price">{product.price} </span>
                            </div>

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

  )
}

export default SaleProductCarousel