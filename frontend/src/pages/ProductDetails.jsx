import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/pages/ProductDetails.scss";
import ReactStars from 'react-stars'
import successIcon from "../assets/icons/success_icon.png"
import voucher from "../assets/icons/voucher.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt, faMinus, faPlus, faCartPlus } from '@fortawesome/free-solid-svg-icons';

import ProductRecommend from '../components/ProductRecommend';
import { Link, useParams } from 'react-router-dom';
import ProductDetailsTapList from '../components/ProductDetailsTapList';
import { getProductById, getProductBySlug } from '../api/productApi';
import { toast } from 'react-toastify';
import useLoading from '../hooks/UseLoading';

const products = [
  { id: 1, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.5, reviews: 120, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 2, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 4.1, reviews: 32, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 3, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 4, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: 5, name: "TÊN SẢN PHẨM", originalPrice: "XXX.XXX đ", discountedPrice: "XXX.XXX đ", rating: 5, reviews: 3, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

// Sample colors for development
const colors = ["red", "blue", "black", "green", "yellow"];

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { slug } = useParams();
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        setLoading(true);
        const data = await getProductBySlug(slug);
        if (data) {
          setProduct(data);
          
          // Initialize selected variants with first value of each attribute
          const initialVariants = {};
          if (data.attributeResponses) {
            data.attributeResponses.forEach(attr => {
              if (attr.attributeValueResponses && attr.attributeValueResponses.length > 0) {
                initialVariants[attr.attributeName] = attr.attributeValueResponses[0].attributeValue;
              }
            });
          }
          setSelectedVariants(initialVariants);
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu sản phẩm!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [slug, setLoading]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (attributeName, value) => {
    setSelectedVariants({
      ...selectedVariants,
      [attributeName]: value
    });
  };

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
      <img src={products[i % products.length].image} alt={`thumb-${i}`} className="dot-thumbnail" />
    ),
    dotsClass: "custom-dots",
  };

  if (!product) return <div className="loading-placeholder">Đang tải thông tin sản phẩm...</div>;

  return (
    <div className="product-details-container">
      <div className="left">
        <div className="carousel">
          <Slider {...settings}>
            {products?.map((product, index) => (
              <div key={product?.id} className='item'>
                <img src={product?.image} alt={`slide-${index}`} className="slide-image" />
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
            <FontAwesomeIcon icon={faShareAlt} color='#207355' size="lg" />
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
        <div className="product-name">{product.productName}</div>
        <div className="rating">
          <ReactStars 
            count={5}
            value={product.ratingValue || 0}
            size={24}
            color2={"#f8b400"} 
            edit={false}
            half={true}
            style={{ display: 'flex', alignItems: 'center' }}
          />
          <div className="score">{product.ratingValue?.toFixed(1) || 0}</div>
          <div className="reviews">({product.ratingResponses?.length || 0} đánh giá)</div>
        </div>
        <div className="prices">
          <div className="original">{product.maxPrice?.toLocaleString()} đ</div>
          <div className="discounted">{product.minPrice?.toLocaleString()} đ</div>
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
          {/* Attribute Selection Based on Product Data */}
          {product.attributeResponses && product.attributeResponses.map((attribute) => (
            <div key={attribute.id} className="variant-selection">
              <h3>{attribute.attributeName}:</h3>
              <div className="variant-options">
                {attribute.attributeValueResponses && attribute.attributeValueResponses.map((value) => (
                  <button
                    key={value.id}
                    className={`variant-option ${selectedVariants[attribute.attributeName] === value.attributeValue ? 'selected' : ''}`}
                    onClick={() => handleVariantSelect(attribute.attributeName, value.attributeValue)}
                  >
                    {value.attributeValue}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <h3>Số lượng:</h3>
          <div className="quantity-control">
            <button 
              className="quantity-btn" 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <input 
              type="text" 
              className="quantity-input" 
              value={quantity} 
              readOnly 
            />
            <button 
              className="quantity-btn" 
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= (product.stock || 100)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">{product.stock} sản phẩm có sẵn</span>
            ) : (
              <span className="out-of-stock">Hết hàng</span>
            )}
          </div>
          <div className="purchase-buttons">
            <button className="add-to-cart">
              <FontAwesomeIcon className='icon' icon={faCartPlus}/>
              <span>Thêm Vào Giỏ Hàng</span>
            </button>
            <button className="buy-now">Mua Ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;