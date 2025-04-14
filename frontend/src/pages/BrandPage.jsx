import React, { useState, useEffect } from "react";
import "../assets/styles/pages/BrandPage.scss";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Mock data cho các thương hiệu
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      const mockBrands = [
        {
          id: 1,
          name: "Nike",
          logo: "/api/placeholder/150/80",
          category: "shoes",
          description:
            "Thương hiệu giày và quần áo thể thao hàng đầu thế giới.",
          featured: true,
          products: 120,
          country: "USA",
          year: 1964,
        },
        {
          id: 2,
          name: "Adidas",
          logo: "/api/placeholder/150/80",
          category: "shoes",
          description:
            "Nhà sản xuất dụng cụ thể thao, quần áo và giày nổi tiếng.",
          featured: true,
          products: 98,
          country: "Germany",
          year: 1949,
        },
        {
          id: 3,
          name: "Zara",
          logo: "/api/placeholder/150/80",
          category: "fashion",
          description: "Thương hiệu thời trang nhanh với xu hướng mới nhất.",
          featured: false,
          products: 245,
          country: "Spain",
          year: 1975,
        },
        {
          id: 4,
          name: "H&M",
          logo: "/api/placeholder/150/80",
          category: "fashion",
          description: "Công ty thời trang bình dân được yêu thích toàn cầu.",
          featured: true,
          products: 187,
          country: "Sweden",
          year: 1947,
        },
        {
          id: 5,
          name: "Samsung",
          logo: "/api/placeholder/150/80",
          category: "electronics",
          description: "Tập đoàn điện tử đa quốc gia hàng đầu thế giới.",
          featured: true,
          products: 76,
          country: "South Korea",
          year: 1938,
        },
        {
          id: 6,
          name: "Apple",
          logo: "/api/placeholder/150/80",
          category: "electronics",
          description:
            "Công ty công nghệ chuyên sản xuất điện thoại, máy tính và phần mềm.",
          featured: true,
          products: 52,
          country: "USA",
          year: 1976,
        },
      ];

      setBrands(mockBrands);
      setFilteredBrands(mockBrands);
      setIsLoading(false);
    }, 1000);
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

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "shoes", label: "Giày dép" },
    { value: "fashion", label: "Thời trang" },
    { value: "electronics", label: "Điện tử" },
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
                  className={`brand-card ${brand.featured ? "featured" : ""}`}
                  onClick={() => handleBrandClick(brand)}
                >
                  <div className="brand-logo">
                    <img src={brand.logo} alt={brand.name} />
                  </div>
                  <div className="brand-info">
                    <h3>{brand.name}</h3>
                    <p className="brand-category">
                      {
                        categories.find((c) => c.value === brand.category)
                          ?.label
                      }
                    </p>
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
                src={selectedBrand.logo}
                alt={selectedBrand.name}
                className="detail-logo"
              />
              <div className="detail-header-info">
                <h2>{selectedBrand.name}</h2>
                <p className="origin">
                  Xuất xứ: {selectedBrand.country} • Thành lập:{" "}
                  {selectedBrand.year}
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
                <p>
                  {
                    categories.find((c) => c.value === selectedBrand.category)
                      ?.label
                  }
                </p>
              </div>
              <div className="detail-section">
                <h3>Số lượng sản phẩm</h3>
                <p>{selectedBrand.products} sản phẩm</p>
              </div>
            </div>
            <div className="brand-detail-footer">
              <button className="view-products-btn">Xem tất cả sản phẩm</button>
            </div>
          </div>
        </div>
      )}

      <div className="featured-brands">
        <h2>Thương hiệu nổi bật</h2>
        <div className="featured-brands-list">
          {brands
            .filter((brand) => brand.featured)
            .map((brand) => (
              <div
                key={brand.id}
                className="featured-brand-item"
                onClick={() => handleBrandClick(brand)}
              >
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BrandPage;
