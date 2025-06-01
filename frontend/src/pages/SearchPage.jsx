import { useState, useEffect, useRef } from "react";
import "../assets/styles/pages/SearchPage.scss";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import CheckBoxList from "../components/CheckBoxList";
import {
  ProductGridSkeleton,
  ProductListSkeleton,
  CheckBoxListSkeleton,
} from "../components/SkeletonLoading";
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
import { getAllBrands } from "../api/brandApi";
import { getAllCategories } from "../api/categoryApi";

const selectOptions = [
  { value: "latest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "rating-asc", label: "Đánh giá tăng dần" },
  { value: "rating-desc", label: "Đánh giá giảm dần" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
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
  const [maxPrice, setMaxPrice] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [sortOption, setSortOption] = useState(selectOptions[0]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [filterProducts, setFilterProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isFirstRender = useRef(true);
  const { loading, setLoading } = useLoading();

  const navigate = useNavigate();

  // Helper function to create URL with updated page parameter
  const createPageUrl = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber > 0) {
      params.set("page", pageNumber);
    } else {
      params.delete("page");
    }
    return `?${params.toString()}`;
  };

  const fetchBrands = async () => {
    setBrandsLoading(true);
    const data = await getAllBrands();

    if (data) {
      setBrands(data);

      const brandsString = searchParams.get("brands") || "";
      if (brandsString) {
        const selectedBrandNames = brandsString.split(",");
        const newSelectedBrands = data.filter((brand) =>
          selectedBrandNames.includes(brand.name)
        );
        setSelectedBrands(newSelectedBrands);
      }
    } else {
      toast.error("Có lỗi xảy ra!");
    }
    setBrandsLoading(false);
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    const data = await getAllCategories();

    if (data) {
      setCategories(data);
      const categoriesString = searchParams.get("categories") || "";
      if (categoriesString) {
        const selectedCategoryNames = categoriesString.split(",");
        const newSelectedCategories = data.filter((category) =>
          selectedCategoryNames.includes(category.name)
        );
        setSelectedCategories(newSelectedCategories);
      }
    } else {
      toast.error("Có lỗi xảy ra!");
    }
    setCategoriesLoading(false);
  };

  useEffect(() => {
    const page = searchParams.get("page");
    setCurrentPage(parseInt(page) || 0);

    fetchBrands();
    fetchCategories();

    const viewModeParam = searchParams.get("view-mode") || "grid";
    setViewMode(viewModeParam);

    const pricesString = searchParams.get("priceRange") || "";

    if (pricesString) {
      const selectedPriceNames = pricesString.split(",");
      const newSelectedPrices = priceRanges.filter((price) =>
        selectedPriceNames.includes(price.name)
      );
      setSelectedPriceRange(newSelectedPrices);

      // Cập nhật minPrice và maxPrice dựa trên khoảng giá đã chọn
      if (newSelectedPrices.length > 0) {
        const minValue = Math.min(...newSelectedPrices.map((p) => p.min));
        const maxValues = newSelectedPrices
          .map((p) => p.max)
          .filter((p) => p !== null);
        const maxValue =
          maxValues.length > 0 ? Math.max(...maxValues) : 1000000000;

        setMinPrice(minValue);
        setMaxPrice(maxValue);
      }
    }
  }, [searchParams]);

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
    const search = searchParams.get("s") || "";

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

    // Scroll to top khi filter hoặc pagination thay đổi
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [searchParams, maxPrice, minPrice, currentPage, sortOption]);

  const updateUrlParams = (key, values, extractKey = "id") => {
    const params = new URLSearchParams(searchParams);
    if (values.length > 0) {
      params.set(key, values?.map((item) => item[extractKey]).join(","));
    } else {
      params.delete(key);
    }
    // Reset page to 0 when filters change
    params.delete("page");
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
    // Reset page to 0 when sort changes
    params.delete("page");
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
          <Link className="grid-item" key={product.id} to={`${product.slug}`}>
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
          </Link>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="product-list">
        {filterProducts.map((product) => (
          <Link className="list-item" key={product.id} to={`${product.slug}`}>
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
          </Link>
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPage <= 1) return null;

    return (
      <div className="pagination">
        {currentPage > 0 ? (
          <Link
            to={createPageUrl(currentPage - 1)}
            className="pagination-button"
          >
            &lt; Trước
          </Link>
        ) : (
          <span className="pagination-button disabled">&lt; Trước</span>
        )}

        {[...Array(totalPage).keys()].map((page) => (
          <Link
            key={page}
            to={createPageUrl(page)}
            className={`pagination-number ${
              currentPage === page ? "active" : ""
            }`}
          >
            {page + 1}
          </Link>
        ))}

        {currentPage < totalPage - 1 ? (
          <Link
            to={createPageUrl(currentPage + 1)}
            className="pagination-button"
          >
            Sau &gt;
          </Link>
        ) : (
          <span className="pagination-button disabled">Sau &gt;</span>
        )}
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
          {brandsLoading ? (
            <CheckBoxListSkeleton title="Thương hiệu" count={5} />
          ) : (
            <CheckBoxList
              title={"Thương hiệu"}
              listCheckBox={brands}
              setSelect={handleBrandChange}
              selected={selectedBrands}
              loading={false}
            />
          )}

          {categoriesLoading ? (
            <CheckBoxListSkeleton title="Phân loại" count={6} />
          ) : (
            <CheckBoxList
              title={"Phân loại"}
              listCheckBox={categories}
              setSelect={handleCategoryChange}
              selected={selectedCategories}
              loading={false}
            />
          )}

          <CheckBoxList
            title={"Khoảng giá"}
            listCheckBox={priceRanges}
            setSelect={handlePriceChange}
            selected={selectedPriceRange}
            loading={false}
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
              {loading ? (
                <div
                  className="skeleton-box"
                  style={{ width: "200px", height: "20px" }}
                />
              ) : (
                <>
                  Hiển thị {filterProducts.length} sản phẩm{" "}
                  {totalPage > 0
                    ? `(Trang ${currentPage + 1}/${totalPage})`
                    : ""}
                </>
              )}
            </div>
          </div>

          {loading ? (
            // Hiển thị skeleton thay vì loading spinner
            viewMode === "grid" ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <ProductListSkeleton count={8} />
            )
          ) : filterProducts.length > 0 ? (
            <>
              {viewMode === "grid" ? renderGridView() : renderListView()}
              {renderPagination()}
            </>
          ) : (
            <div className="no-results">
              <p>Không tìm thấy sản phẩm phù hợp.</p>
              <Link
                to="?"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setSelectedPriceRange([]);
                }}
              >
                Xóa bộ lọc
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
