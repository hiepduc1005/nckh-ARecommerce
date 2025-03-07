import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/pages/ProductDetails.scss";
import ReactStars from 'react-stars'
import heartIcon from "../assets/icons/heart-icon.png"
import shareIcon from "../assets/icons/share-icon.png"
import successIcon from "../assets/icons/success_icon.png"
import voucher from "../assets/icons/voucher.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt } from '@fortawesome/free-solid-svg-icons';

import ProductRecommend from '../components/ProductRecommend';
import { Link, useParams } from 'react-router-dom'; // Import Link để điều hướng
import ProductDetailsTapList from '../components/ProductDetailsTapList';
import { getProductById } from '../api/productApi';
import { toast } from 'react-toastify';
import useLoading from '../hooks/UseLoading';

const products = [
  { id: 1, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.5, reviews: 120, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.1, reviews: 32, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },

  { id: 5, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },

];

const colors = ["red", "blue", "black", "green", "yellow"];


const ProductDetails = () => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const [product,setProduct] = useState()

  const {productId} = useParams();
  const {setLoading} = useLoading();

  useEffect(() => {
      const fetchProductById = async () => {
          const data = await getProductById(productId);
          console.log(data)
          if(data){
              setProduct(data);
          }else{
              toast.error("Có lỗi xảy ra!")
          }
      }

      setLoading(true)
      fetchProductById();
      setLoading(false)
  }, [productId])

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 5000,
    autoplay: true,
    slidesToShow: 1,
    pauseOnHover: true,
    slidesToScroll: 1,
    customPaging: (i) => (
      <img src={products[i % products.length].image} alt={`thumb-${i}`} className="dot-thumbnail" />    ),
      dotsClass: "custom-dots",
  };

  return (
    <div className="product-details">
      <div className="left">
        <div className="carousel">
          <Slider {...settings}>
            {products.map((product, index) => (
              <div key={product.id} className='item'>
                <img src={product.image} alt={`slide-${index}`} className="slide-image" />
              </div>
            ))}
          </Slider>
        </div>
        <div className="button-group">
          <div className="wishlist">
            <FontAwesomeIcon icon={faHeart} color='#207355' size="lg" />
            <span>Thêm vào yêu thích</span>
          </div>
          <div className="share">
            <img src={shareIcon} alt="" />
            <span>Chia sẻ</span>
          </div>
        </div>
        <ProductDetailsTapList product={product}/>
        <div className="products-recommend">
          <div className="title">Đề xuất cho bạn</div>
          <ProductRecommend products={products}/>
          <Link 
            to={"/"}
            content='Xem thêm'
            title='Xem thêm'
            className='more'
          >Xem thêm</Link>
        </div>
      </div>
      <div className="right">
        <div className="product-name">Tên sản phẩm</div>
        <div className="rating">
          <ReactStars 
              count={5}
              value={4}
              size={24}
              color2={"#f8b400"} 
              edit={false}
              half={true}
              style={{ display: 'flex', alignItems: 'center' }}
          />
          <div className="score">4.0</div>
          <div className="reviews">xx đánh giá</div>
        </div>
        <div className="prices">
          <div className="original">5xx.xxx đ</div>
          <div className="discounted">3xx.xxx đ</div>
        </div>
        <div className="benefits">
          <h3>Quyền lợi</h3>
          <div className="benefit-item">
            <img src={voucher} alt="Voucher" />
            <span>Giảm 30% khi nhận mã: MOIMOI2024</span>
          </div>
          <div className="benefit-item">
            <img src={successIcon} alt="Free Shipping" />
            <span>Miễn phí ship và hoàn hàng</span>
          </div>
          <div className="benefit-item">
            <img src={successIcon} alt="Refund" />
            <span>Hoàn tiền 100% khi trả hàng</span>
          </div>
        </div>
        <div className="product-options">
          <h3>Màu sắc:</h3>
          <div className="colors">
            {colors.map(color => (
              <span 
                key={color} 
                className={`color color-${color} ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></span>
            ))}
          </div>
          <h3>Kích thước:</h3>
          <div className="sizes">
            <button className="size">Lớn</button>
            <button className="size">Vừa</button>
            <button className="size">Tùy chỉnh</button>
          </div>
          <h3>Số lượng:</h3>
          <div className="quantity">
            <div>-</div>
            <div className="value">1</div>
            <div>+</div>
          </div>
          <div className="purchase-buttons">
            {/* <button className="choose-lens">Chọn Lens</button> */}
            <button className="add-to-cart">Thêm vào giỏ hàng</button>
            <button className="buy-now">Mua ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
