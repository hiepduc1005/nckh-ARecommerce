import React, { useEffect, useState } from "react";
import "../assets/styles/pages/Home.scss";
import banner from "../assets/images/banner4.png";
import useLoading from "../hooks/UseLoading";
import { getProductsFeatured, getProductsPaginate } from "../api/productApi";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import ReactStars from "react-stars";
import { formatCurrency } from "../utils/ultils";
import { getAllCategories } from "../api/categoryApi";

const Home = () => {
  const { setLoading } = useLoading();
  const [products, setProducts] = useState([]);
  const [productFeatured, setProductFeatured] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const navigate = useNavigate();

  const handleNavigateProductDetails = (slug) => {
    navigate(`/products/${slug}`);
  };

  const fetchProductFeatured = async () => {
    const data = await getProductsFeatured(0, 8);

    if (data) {
      setProductFeatured(data.content);
    }
  };

  const fetchCategoriesFeatured = async () => {
    const data = await getAllCategories();

    if (data) {
      setPopularCategories(data);
    }
  };

  useEffect(() => {
    document.title = "Trang chủ | HHQTV Store";
    setLoading(true);
    const fetchProducts = async () => {
      const data = await getProductsPaginate(1, 8);
      setProducts(data.content);
    };
    fetchCategoriesFeatured();
    fetchProductFeatured();
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
              <Link
                to={`/products??categories=${category.name}`}
                key={category.id}
                className="category-item"
              >
                <div className="image-container">
                  <img
                    src={`http://localhost:8080${category.imagePath}`}
                    alt={category.name}
                  />
                  <div className="overlay"></div>
                </div>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Sản phẩm nổi bật</h2>
          <div className="products-grid">
            {productFeatured.map((product) => (
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
          <div className="view-more" onClick={() => navigate("/products")}>
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
