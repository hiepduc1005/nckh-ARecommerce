import { useState, useEffect, useRef } from "react";
import "../assets/styles/pages/SearchPage.scss";
import { useNavigate, useSearchParams } from "react-router-dom";

import CheckBoxList from "../components/CheckBoxList";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faShoppingCart,
  faGrip,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-stars";
import { getProductsFilter } from "../api/productApi";
import useLoading from "../hooks/UseLoading";

const selectOptions = [
  { value: "latest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "rating-asc", label: "Đánh giá tăng dần" },
  { value: "rating-desc", label: "Đánh giá giảm dần" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
];

const categories = [
  { id: 1, name: "Kính râm" },
  { id: 2, name: "Kính thời trang" },
  { id: 3, name: "Kính cận" },
  { id: 4, name: "Kính viễn" },
  { id: 5, name: "Kính lão" },
  { id: 6, name: "Giày thể thao" },
  { id: 7, name: "Giày thời trang" },
  { id: 8, name: "Giày du lịch" },
];

const brands = [
  { id: 1, name: "Cyxus" },
  { id: 2, name: "JINS" },
  { id: 3, name: "Lenskart" },
  { id: 4, name: "Oakley" },
  { id: 5, name: "Persol" },
  { id: 6, name: "Gucci" },
  { id: 7, name: "Dior" },
  { id: 8, name: "Gentle Monster" },
];

const priceRanges = [
  { id: 1, name: "100.000đ trở xuống", min: 0, max: 100000 },
  { id: 2, name: "100.000đ - 500.000đ", min: 100000, max: 500000 },
  { id: 3, name: "500.000đ - 2.000.000đ", min: 500000, max: 2000000 },
  { id: 4, name: "2.000.000đ trở lên", min: 2000000, max: null },
];

const SearchPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [minPrice, setMinPrice] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortOption, setSortOption] = useState(selectOptions[0]);

  const [filterProducts, setFilterProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  const { loading, setLoading } = useLoading();

  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`${productId}`);
  };

  const handleAddToCart = (productId, event) => {
    event.stopPropagation();
    // Add to cart logic here
    console.log("Adding to cart:", productId);
  };

  const handleAddToWishlist = (productId, event) => {
    event.stopPropagation();
    // Add to wishlist logic here
    console.log("Adding to wishlist:", productId);
  };

  const handleShare = (productId, event) => {
    event.stopPropagation();
    // Share product logic here
    console.log("Sharing product:", productId);
  };

  const fetchFilterProduct = async (newFilters) => {
    setLoading(true);
    const data = await getProductsFilter(newFilters);

    if (data) {
      setTotalPage(data?.totalPages);
      setFilterProducts(data?.content);
    }

    setLoading(false);
  };

  useEffect(() => {
    const categoriesString = searchParams.get("categories") || "";
    const brandsString = searchParams.get("brands") || "";
    const pricesString = searchParams.get("priceRange") || "";
    const search = searchParams.get("s") || "";
    const viewModeParam = searchParams.get("view-mode") || "grid";

    setViewMode(viewModeParam);

    if (categoriesString) {
      setSelectedCategories(() =>
        categories.filter((item) =>
          categoriesString.split(",").includes(item.name)
        )
      );
    }

    if (brandsString) {
      setSelectedBrands(() =>
        brands.filter((item) => brandsString.split(",").includes(item.name))
      );
    }

    if (pricesString) {
      setSelectedPriceRange(() =>
        priceRanges.filter((item) =>
          pricesString.split(",").includes(item.name)
        )
      );
    }

    const newFilters = {
      size: 8,
      brands: brandsString,
      categories: categoriesString,
      maxPrice,
      minPrice,
      page: currentPage,
      keyword: search,
      sort: sortOption.value,
    };

    fetchFilterProduct(newFilters);
  }, [searchParams, maxPrice, minPrice, currentPage, sortOption]);

  const updateUrlParams = (key, values, extractKey = "id") => {
    const params = new URLSearchParams(searchParams);
    if (values.length > 0) {
      params.set(key, values?.map((item) => item[extractKey]).join(","));
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (newSelected) => {
    setSelectedCategories(newSelected);
    updateUrlParams("categories", newSelected, "name");
  };

  const handleBrandChange = (newSelected) => {
    setSelectedBrands(newSelected);
    updateUrlParams("brands", newSelected, "name");
  };

  const handlePriceChange = (newSelected) => {
    setSelectedPriceRange(newSelected);
    updateUrlParams("priceRange", newSelected, "name");

    if (newSelected.length > 0) {
      const minValue = Math.min(...newSelected.map((p) => p.min));
      const maxValues = newSelected.map((p) => p.max).filter((p) => p !== null);
      const maxValue =
        maxValues.length > 0 ? Math.max(...maxValues) : 1000000000;

      setMinPrice(minValue);
      setMaxPrice(maxValue);
    } else {
      setMinPrice(0);
      setMaxPrice(1000000000);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    // Update URL params for sorting
    const params = new URLSearchParams(searchParams);
    if (option) {
      params.set("sort", option.value);
    } else {
      params.delete("sort");
      setSortOption(selectOptions[0]);
    }
    setSearchParams(params);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    // Update URL params for view mode
    const params = new URLSearchParams(searchParams);
    params.set("view-mode", mode);
    setSearchParams(params);
  };

  const renderGridView = () => {
    return (
      <div className="product-grid">
        {filterProducts.map((product) => (
          <div
            className="grid-item"
            key={product.id}
            onClick={() => handleProductClick(product.slug)}
          >
            <div className="product-image">
              <img
                src={`http://localhost:8080${product.imagePath}`}
                alt={product.productName}
              />
              <div className="product-actions">
                <button onClick={(e) => handleAddToCart(product.slug, e)}>
                  <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                </button>
                <button onClick={(e) => handleProductClick(product.slug, e)}>
                  <FontAwesomeIcon icon={faHeart} className="icon" />
                </button>
                <button onClick={(e) => handleShare(product.id, e)}>
                  <FontAwesomeIcon icon={faShare} className="icon" />
                </button>
              </div>
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.productName}</h3>
              <div className="product-price">
                <span className="discount-price">
                  {product.minPrice.toLocaleString()}đ
                </span>
                {product.maxPrice > product.minPrice && (
                  <span className="original-price">
                    {product.maxPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
              <div className="product-rating">
                <ReactStars
                  count={5}
                  value={product.ratingValue || 0}
                  size={16}
                  color2={"#f8b400"}
                  edit={false}
                  half={true}
                />
                <span className="rating-count">
                  ({product?.ratingResponses?.length || 0})
                </span>
              </div>
              <p className="product-description">{product.shortDescription}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="product-list">
        {filterProducts.map((product) => (
          <div
            className="list-item"
            key={product.id}
            onClick={() => handleProductClick(product.id)}
          >
            <div className="product-image">
              <img
                src={`http://localhost:8080${product.imagePath}`}
                alt={product.productName}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.productName}</h3>
              <div className="product-price">
                <span className="discount-price">
                  {product.minPrice.toLocaleString()}đ
                </span>
                {product.maxPrice > product.minPrice && (
                  <span className="original-price">
                    {product.maxPrice.toLocaleString()}đ
                  </span>
                )}
              </div>
              <div className="product-rating">
                <ReactStars
                  count={5}
                  value={product.ratingValue || 0}
                  size={16}
                  color2={"#f8b400"}
                  edit={false}
                  half={true}
                />
                <span className="rating-count">
                  ({product?.ratingResponses?.length || 0})
                </span>
              </div>
              <p className="product-description">{product.shortDescription}</p>
              <div className="product-attributes">
                {product.attributeResponses &&
                  product.attributeResponses.length > 0 && (
                    <div className="attributes">
                      {product.attributeResponses.slice(0, 2).map((attr) => (
                        <div key={attr.id} className="attribute">
                          <span className="attribute-name">
                            {attr.attributeName}:
                          </span>
                          <span className="attribute-values">
                            {attr.attributeValueResponses
                              .slice(0, 2)
                              .map((val) => val.attributeValue)
                              .join(", ")}
                            {attr.attributeValueResponses.length > 2 && "..."}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <div className="product-actions">
                <button onClick={(e) => handleAddToCart(product.id, e)}>
                  <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                  <span>Thêm vào giỏ</span>
                </button>
                <button onClick={(e) => handleAddToWishlist(product.id, e)}>
                  <FontAwesomeIcon icon={faHeart} className="icon" />
                  <span>Yêu thích</span>
                </button>
                <button onClick={(e) => handleShare(product.id, e)}>
                  <FontAwesomeIcon icon={faShare} className="icon" />
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPage <= 1) return null;

    return (
      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="pagination-button"
        >
          &lt; Trước
        </button>

        {[...Array(totalPage).keys()].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`pagination-number ${
              currentPage === page ? "active" : ""
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPage - 1}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="pagination-button"
        >
          Sau &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="product-search">
      <div className="search-background-image">
        <span>Tìm kiếm</span>
        {searchParams.get("s") ? (
          <p>Kết quả cho từ khóa: {searchParams.get("s")}</p>
        ) : (
          ""
        )}
      </div>

      <div className="body">
        <div className="filter-sidebar">
          <CheckBoxList
            title={"Thương hiệu"}
            listCheckBox={brands}
            setSelect={handleBrandChange}
            selected={selectedBrands}
            loading={loading}
          />
          <CheckBoxList
            title={"Phân loại"}
            listCheckBox={categories}
            setSelect={handleCategoryChange}
            selected={selectedCategories}
            loading={loading}
          />
          <CheckBoxList
            title={"Khoảng giá"}
            listCheckBox={priceRanges}
            setSelect={handlePriceChange}
            selected={selectedPriceRange}
            loading={loading}
          />
        </div>

        <div className="product-content">
          <div className="product-header">
            <div className="view-options">
              <button
                className={`view-option ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => toggleViewMode("grid")}
              >
                <FontAwesomeIcon icon={faGrip} />
              </button>
              <button
                className={`view-option ${viewMode === "list" ? "active" : ""}`}
                onClick={() => toggleViewMode("list")}
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>

            <div className="sort-container">
              <div className="title">Sắp xếp theo</div>
              <Select
                className="sort-select"
                classNamePrefix="select"
                value={sortOption}
                onChange={handleSortChange}
                isDisabled={loading}
                isLoading={loading}
                isClearable={true}
                isSearchable={true}
                name="sort"
                options={selectOptions}
              />
            </div>

            <div className="results-info">
              Hiển thị {filterProducts.length} sản phẩm{" "}
              {totalPage > 0 ? `(Trang ${currentPage + 1}/${totalPage})` : ""}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : filterProducts.length > 0 ? (
            <>
              {viewMode === "grid" ? renderGridView() : renderListView()}
              {renderPagination()}
            </>
          ) : (
            <div className="no-results">
              <p>Không tìm thấy sản phẩm phù hợp.</p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setSelectedPriceRange([]);
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
