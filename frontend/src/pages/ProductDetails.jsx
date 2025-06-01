import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/pages/ProductDetails.scss";
import ReactStars from "react-stars";
import successIcon from "../assets/icons/success_icon.png";
import voucher from "../assets/icons/voucher.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShareAlt,
  faMinus,
  faPlus,
  faCartPlus,
  faVideo,
  faCubes,
  faCube,
} from "@fortawesome/free-solid-svg-icons";

import ProductRecommend from "../components/ProductRecommend";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductDetailsTapList from "../components/ProductDetailsTapList";
import { getProductById, getProductBySlug } from "../api/productApi";
import { toast } from "react-toastify";
import useLoading from "../hooks/UseLoading";
import { getVariantsByProductSlug } from "../api/variantApi";
import useCart from "../hooks/UseCart";
import { encryptData } from "../utils/ultils";
import VTOGlassModal from "../components/ar/VTOGlassModal";
import Modal3DView from "../components/ar/Modal3DView";
import { trackARViewStart } from "../utils/analytics";
import useAuth from "../hooks/UseAuth";

const products = [
  {
    id: 1,
    name: "TÊN SẢN PHẨM",
    originalPrice: "XXX.XXX đ",
    discountedPrice: "XXX.XXX đ",
    rating: 4.5,
    reviews: 120,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 2,
    name: "TÊN SẢN PHẨM",
    originalPrice: "XXX.XXX đ",
    discountedPrice: "XXX.XXX đ",
    rating: 4.1,
    reviews: 32,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 3,
    name: "TÊN SẢN PHẨM",
    originalPrice: "XXX.XXX đ",
    discountedPrice: "XXX.XXX đ",
    rating: 5,
    reviews: 3,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 4,
    name: "TÊN SẢN PHẨM",
    originalPrice: "XXX.XXX đ",
    discountedPrice: "XXX.XXX đ",
    rating: 5,
    reviews: 3,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: 5,
    name: "TÊN SẢN PHẨM",
    originalPrice: "XXX.XXX đ",
    discountedPrice: "XXX.XXX đ",
    rating: 5,
    reviews: 3,
    image:
      "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState(null);
  const [selectedVariantStock, setSelectVariantStock] = useState(null);
  const [variants, setVariants] = useState([]);

  const [showModalVTO, setShowModalVTO] = useState(false);
  const [showModal3DView, setShowModal3DView] = useState(false);
  const [images, setImages] = useState([]);
  const [colorConfig, setColorConfig] = useState(null);

  const { slug } = useParams();
  const { setLoading } = useLoading();
  const { addItem } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleShowModel3D = () => {
    trackARViewStart(product.id);
    setShowModal3DView(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch product data
        const productData = await getProductBySlug(slug);
        if (productData) {
          setProduct(productData);

          // Fetch variants
          const variantsData = await getVariantsByProductSlug(slug, "", 1, 10);
          if (variantsData) {
            setVariants(variantsData.content);

            // Create images array once we have both product and variants
            const listImage = [
              productData.imagePath,
              ...variantsData.content.map((variant) => variant.imagePath),
            ].filter(Boolean); // Filter out any null or undefined values

            setImages(listImage);
          }
        } else {
          toast.error("Có lỗi xảy ra khi tải dữ liệu sản phẩm!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, setLoading]);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariants(variant.id);
    setSelectVariantStock(variant.quantity);
    setColorConfig(variant?.colorConfig);
    setQuantity(1);
  };

  const handleAddProductToCart = async () => {
    if (!selectedVariants) {
      toast.warning("Bạn chưa chọn biến thể!");
      return;
    }

    await addItem(selectedVariants, quantity);
  };

  const handleClickOrder = () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (!selectedVariants) {
      toast.warning("Bạn chưa chọn biến thể!");
      return;
    }

    const data = {
      coupon: null,
      discountAmount: 0,
      isCustomized: false,
      items: [
        {
          quantity,
          variant: selectedVariants,
        },
      ],
    };

    const encryptedData = encryptData(data);
    const encodedData = encodeURIComponent(encryptedData);

    navigate(`/checkout?encrd=${encodedData}`);
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
      <img
        src={`http://localhost:8080${images[i % images.length]}`}
        alt={`thumb-${i}`}
        className="dot-thumbnail"
      />
    ),
    dotsClass: "custom-dots",
  };

  if (!product)
    return (
      <div className="loading-placeholder">Đang tải thông tin sản phẩm...</div>
    );

  return (
    <div className="product-details-container">
      <div className="left">
        <div className="carousel">
          <Slider {...settings}>
            {images?.map((image, index) => (
              <div key={index} className="item">
                <img
                  src={`http://localhost:8080${image}`}
                  alt={`slide-${index}`}
                  className="slide-image"
                />
              </div>
            ))}
          </Slider>
          <div className="button-try">
            {product?.categories?.some(
              (category) => category.name === "Glasses"
            ) ? (
              <div className="direct" onClick={() => setShowModalVTO(true)}>
                <FontAwesomeIcon className="icon" icon={faVideo} />
                <button>Thử trực tiếp</button>
              </div>
            ) : (
              ""
            )}
            <div className="view" onClick={() => handleShowModel3D()}>
              <FontAwesomeIcon className="icon" icon={faCube} />
              <button>Xem mô hình 3D</button>
            </div>
          </div>
        </div>
        <div className="button-group">
          <div className="wishlist">
            <FontAwesomeIcon icon={faHeart} color="#207355" size="lg" />
            <span>Thêm vào yêu thích</span>
          </div>
          <div className="share">
            <FontAwesomeIcon icon={faShareAlt} color="#207355" size="lg" />
            <span>Chia sẻ</span>
          </div>
        </div>
        <ProductDetailsTapList product={product} />
        <div className="products-recommend">
          <div className="title">Đề xuất cho bạn</div>
          <ProductRecommend products={products} />
          <Link to={"/"} content="Xem thêm" title="Xem thêm" className="more">
            Xem thêm
          </Link>
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
            style={{ display: "flex", alignItems: "center" }}
          />
          <div className="score">{product.ratingValue?.toFixed(1) || 0}</div>
          <div className="reviews">
            ({product.ratingResponses?.length || 0} đánh giá)
          </div>
        </div>
        <div className="prices">
          <div className="original">{product.maxPrice?.toLocaleString()} đ</div>
          <div className="discounted">
            {product.minPrice?.toLocaleString()} đ
          </div>
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
          <h3>Biến thể:</h3>
          {variants &&
            variants.map((variant) => (
              <div key={variant.id} className="variant-selection">
                <div className="variant-options">
                  <button
                    className={`variant-option ${
                      selectedVariants === variant.id ? "selected" : ""
                    }`}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    <div className="variant-image">
                      <img
                        src={`http://localhost:8080${variant.imagePath}`}
                        alt={`Variant ${variant.id}`}
                      />
                    </div>
                    <div className="variant-details">
                      {variant?.attributeValueResponses?.map(
                        (attrValue, index) => (
                          <React.Fragment key={attrValue.id}>
                            <span className="attr-name">
                              {attrValue.attributeName}:{" "}
                            </span>
                            <span className="attr-value">
                              {attrValue.attributeValue}
                            </span>
                            {index <
                              variant.attributeValueResponses.length - 1 && (
                              <span>, </span>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </button>
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
              disabled={
                quantity >= (selectedVariantStock || product.stock || 100)
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">
                {selectedVariantStock || product.stock} sản phẩm có sẵn
              </span>
            ) : (
              <span className="out-of-stock">Hết hàng</span>
            )}
          </div>
          <div className="purchase-buttons">
            <button
              className="add-to-cart"
              onClick={() => handleAddProductToCart()}
            >
              <FontAwesomeIcon className="icon" icon={faCartPlus} />
              <span>Thêm Vào Giỏ Hàng</span>
            </button>
            <button className="buy-now" onClick={() => handleClickOrder()}>
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
      {showModalVTO ? (
        <VTOGlassModal
          isOpen={showModalVTO}
          onClose={() => setShowModalVTO(false)}
          modelUrl={
            product.modelPath
              ? `http://localhost:8080${product.modelPath}`
              : null
          }
        />
      ) : (
        ""
      )}

      {showModal3DView ? (
        <Modal3DView
          isOpen={showModal3DView}
          onClose={() => setShowModal3DView(false)}
          modelUrl={
            product.modelPath
              ? `http://localhost:8080${product.modelPath}`
              : null
          }
          colorConfig={colorConfig ? JSON.parse(colorConfig) : {}}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductDetails;
