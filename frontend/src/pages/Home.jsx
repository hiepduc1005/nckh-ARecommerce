import React, { useEffect, useState } from "react";
import "../assets/styles/pages/Home.scss";
import banner from "../assets/images/banner4.png";
import ProductCarousel from "../components/ProductCarousel";
import glassImage from "../assets/images/glass-image.png";
import SaleProductCarousel from "../components/SaleProductCarousel";
import useLoading from "../hooks/UseLoading";
import { getProductsPaginate } from "../api/productApi";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import ReactStars from "react-stars";
import { formatCurrency } from "../utils/ultils";
const popularCategories = [
  { id: 1, name: "Kính mắt", image: "/api/placeholder/200/200" },
  { id: 2, name: "Kính thời trang", image: "/api/placeholder/200/200" },
  { id: 3, name: "Kính râm", image: "/api/placeholder/200/200" },
  { id: 4, name: "Gọng kính", image: "/api/placeholder/200/200" },
];

const Home = () => {
  const categoryData = {
    title: "Kính Mắt",
    description: "Tổng hợp các mẫu kính nổi bật trong tháng vừa qua",
    image: glassImage,
  };

  const { setLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const handleNavigateProductDetails = (slug) => {
    navigate(`/products/${slug}`);
  };

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const data = await getProductsPaginate(1, 8);
      setProducts(data.content);
    };
    fetchProducts();
    setLoading(false);
  }, []);

  return (
    <div className="homepage-container">
      <div className="banner"></div>

      {/* Customize CTA Section */}
      <div className="customize-cta-container">
        <div className="customize-cta-content">
          <h2>Thiết Kế Sản Phẩm Của Riêng Bạn</h2>
          <p>
            Tự do sáng tạo với công cụ customize độc đáo cho giày và kính mắt
          </p>
          <div className="customize-buttons">
            <Link to="/customize/glasses" className="customize-button glasses">
              <span className="icon">👓</span>
              Customize Kính Mắt
            </Link>
            <Link to="/customize/shoes" className="customize-button shoes">
              <span className="icon">👟</span>
              Customize Giày
            </Link>
          </div>
        </div>
        <div className="customize-cta-images">
          <div className="customize-image glasses"></div>
          <div className="customize-image shoes"></div>
        </div>
      </div>

      <section className="popular-categories">
        <div className="container">
          <h2>Danh mục phổ biến</h2>
          <div className="categories-grid">
            {popularCategories.map((category) => (
              <div key={category.id} className="category-item">
                <div className="image-container">
                  <img src={category.image} alt={category.name} />
                  <div className="overlay"></div>
                </div>
                <h3>{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Sản phẩm nổi bật</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div
                  className="image-container"
                  onClick={() => handleNavigateProductDetails(product.slug)}
                >
                  <img
                    src={`http://localhost:8080${product.imagePath}`}
                    alt={product.productName}
                  />
                  <button className="wishlist-button">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="brand">{product.brandResponse.name}</div>
                  <h3>{product.productName}</h3>
                  <div className="rating">
                    <ReactStars
                      count={5}
                      value={product.ratingValue}
                      size={18}
                      color2={"#f59e0b"} // amber-500 for filled stars
                      color1={"#e5e7eb"} // gray-200 for empty stars
                      edit={false}
                      half={true}
                    />
                  </div>
                  <div className="price-cart">
                    <div className="price">
                      {formatCurrency(product.minPrice)}
                      {product.minPrice !== product.maxPrice && (
                        <span className="price-range">
                          {" "}
                          - {formatCurrency(product.maxPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      className="cart-button"
                      onClick={() => handleNavigateProductDetails(product.slug)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-more">
            <button>Xem thêm sản phẩm</button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promotional-banner">
        <div className="container">
          <div className="banner-promo">
            <div className="banner-content">
              <h2>Ưu đãi đặc biệt</h2>
              <p>
                Giảm giá lên đến 30% cho các sản phẩm kính mắt cao cấp trong
                tuần này
              </p>
              <button>Khám phá ngay</button>
            </div>
            <div className="banner-image">
              <img src={banner} alt="Promotional banner" />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="new-arrivals">
        <div className="container">
          <h2>Sản phẩm mới</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={`new-${product.id}`} className="product-card">
                <div
                  className="image-container"
                  onClick={() => handleNavigateProductDetails(product.slug)}
                >
                  <img
                    src={`http://localhost:8080${product.imagePath}`}
                    alt={product.productName}
                  />
                  <div className="new-tag">Mới</div>
                  <button className="wishlist-button">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="brand">{product.brandResponse.name}</div>
                  <h3>{product.productName}</h3>
                  <div className="rating">
                    <ReactStars
                      count={5}
                      value={product.ratingValue}
                      size={18}
                      color2={"#f59e0b"} // amber-500 for filled stars
                      color1={"#e5e7eb"} // gray-200 for empty stars
                      edit={false}
                      half={true}
                    />
                  </div>
                  <div className="price-cart">
                    <div className="price">
                      {formatCurrency(product.minPrice)}
                      {product.minPrice !== product.maxPrice && (
                        <span className="price-range">
                          {" "}
                          - {formatCurrency(product.maxPrice)}
                        </span>
                      )}
                    </div>
                    <button
                      className="cart-button"
                      onClick={() => handleNavigateProductDetails(product.slug)}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
