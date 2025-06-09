import React, { useState, useEffect } from "react";
import "../assets/styles/pages/BrandPage.scss";
import { getAllBrands } from "../api/brandApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Thương hiệu | HHQTV Store";
  }, []);

  const fetchBrands = async () => {
    const data = await getAllBrands();

    if (data) {
      setBrands(data);
      setIsLoading(false);
    } else {
      toast.error("Có lỗi xảy ra!");
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  // Lọc thương hiệu dựa trên từ khóa tìm kiếm và danh mục
  useEffect(() => {
    const results = brands.filter((brand) => {
      const matchSearch = brand.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || brand.category === selectedCategory;
      return matchSearch && matchCategory;
    });

    setFilteredBrands(results);
  }, [searchTerm, selectedCategory, brands]);

  // Xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Xử lý hiển thị chi tiết thương hiệu
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
  };

  // Đóng modal chi tiết thương hiệu
  const closeBrandDetail = () => {
    setSelectedBrand(null);
  };

  const handleNavigateProduct = (category) => {
    navigate(`/products?brands=${category}`);
  };

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "SHOES", label: "Giày dép" },
    { value: "GLASSES", label: "Kính" },
  ];

  return (
    <div className="brand-page">
      <div className="brand-header">
        <h1>Thương Hiệu</h1>
        <p>
          Khám phá các thương hiệu chất lượng đang được bán trên shop của chúng
          tôi
        </p>
      </div>

      <div className="brand-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`category-button ${
                selectedCategory === category.value ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Đang tải thương hiệu...</div>
      ) : (
        <>
          {filteredBrands.length > 0 ? (
            <div className="brand-grid">
              {filteredBrands.map((brand) => (
                <div
                  key={brand.id}
                  className={`brand-card ${true ? "featured" : ""}`}
                  onClick={() => handleBrandClick(brand)}
                >
                  <div className="brand-logo">
                    <img
                      src={`http://localhost:8080${brand?.imagePath}`}
                      alt={brand.name}
                    />
                  </div>
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    <p className="brand-category">{brand.category}</p>
                    <p className="brand-description">
                      {brand.description.substring(0, 60)}...
                    </p>
                    <div className="brand-stats">
                      <span>{brand.products} sản phẩm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>
                Không tìm thấy thương hiệu phù hợp. Vui lòng thử lại với từ khóa
                khác.
              </p>
            </div>
          )}
        </>
      )}

      {selectedBrand && (
        <div className="brand-detail-modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeBrandDetail}>
              &times;
            </span>
            <div className="brand-detail-header">
              <img
                src={`http://localhost:8080${selectedBrand?.imagePath}`}
                alt={selectedBrand.name}
                className="detail-logo"
              />
              <div className="detail-header-info">
                <h2>{selectedBrand.name}</h2>
                <p className="origin">
                  Xuất xứ: {selectedBrand.origin} • Thành lập:{" "}
                  {selectedBrand.establish}
                </p>
              </div>
            </div>
            <div className="brand-detail-body">
              <div className="detail-section">
                <h3>Thông tin</h3>
                <p>{selectedBrand.description}</p>
              </div>
              <div className="detail-section">
                <h3>Danh mục</h3>
                <p>{selectedBrand.category}</p>
              </div>
              <div className="detail-section">
                <h3>Số lượng sản phẩm</h3>
                <p>{selectedBrand.totalProducts} sản phẩm</p>
              </div>
            </div>
            <div className="brand-detail-footer">
              <button
                className="view-products-btn"
                onClick={() => handleNavigateProduct(selectedBrand.name)}
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="featured-brands">
        <h2>Thương hiệu nổi bật</h2>
        <div className="featured-brands-list">
          {brands
            .filter((brand) => true)
            .map((brand) => (
              <div
                key={brand.id}
                className="featured-brand-item"
                onClick={() => handleBrandClick(brand)}
              >
                <img
                  src={`http://localhost:8080${brand?.imagePath}`}
                  alt={brand.name}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
