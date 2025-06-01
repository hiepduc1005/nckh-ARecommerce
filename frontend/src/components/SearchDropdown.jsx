import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/components/SearchDropdown.scss";
import { getProductsFilter } from "../api/productApi";
import { toast } from "react-toastify";

const SearchDropdown = ({ onSearch, searchIcon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounce search function
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim()) {
      debounceRef.current = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = async (term) => {
    setIsLoading(true);
    try {
      const filters = {
        keyword: term,
        sort: "sold-quantity",
        size: 5,
        page: 0,
      };
      const data = await getProductsFilter(filters);

      if (data) {
        setSearchResults(data.content);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra!");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);

    if (value.trim()) {
      setIsLoading(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = (product) => {
    setSearchTerm(product.productName);
    setIsOpen(false);

    // Add to recent searches
    const newRecentSearches = [
      product.productName,
      ...recentSearches.filter((item) => item !== product.productName),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
  };

  const handleRecentSearchClick = (term) => {
    setSearchTerm(term);
    setIsOpen(false);
    if (onSearch) {
      onSearch(term);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-dropdown" ref={dropdownRef}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="search-input"
        />
        <button
          className="search-button"
          onClick={() => onSearch && onSearch(searchTerm)}
        >
          <img src={searchIcon} alt="Search" />
        </button>
      </div>

      {isOpen && (
        <div className="search-dropdown-menu">
          {isLoading && (
            <div className="search-loading">
              <div className="loading-spinner"></div>
              <span>Đang tìm kiếm...</span>
            </div>
          )}

          {!isLoading && searchTerm && searchResults.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <span>Kết quả tìm kiếm</span>
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="search-result-item"
                  onClick={() => handleResultClick(product)}
                >
                  <div className="product-image">
                    <img
                      src={`http://localhost:8080${product.imagePath}`}
                      alt={product.productName}
                    />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{product.productName}</div>
                    <div className="product-price">
                      {product.minPrice === product.maxPrice
                        ? formatPrice(product.minPrice)
                        : `${formatPrice(product.minPrice)} - ${formatPrice(
                            product.maxPrice
                          )}`}
                    </div>
                    <div className="product-rating">
                      <span className="rating-stars">
                        {"★".repeat(Math.floor(product.ratingValue))}
                        {"☆".repeat(5 - Math.floor(product.ratingValue))}
                      </span>
                      <span className="rating-value">
                        ({product.ratingValue})
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && searchTerm && searchResults.length === 0 && (
            <div className="no-results">
              <span>Không tìm thấy sản phẩm nào</span>
            </div>
          )}

          {!searchTerm && recentSearches.length > 0 && (
            <div className="search-section">
              <div className="search-section-header">
                <span>Tìm kiếm gần đây</span>
              </div>
              {recentSearches.map((term, index) => (
                <div
                  key={index}
                  className="recent-search-item"
                  onClick={() => handleRecentSearchClick(term)}
                >
                  <span className="recent-icon">🕒</span>
                  <span>{term}</span>
                </div>
              ))}
            </div>
          )}

          {!searchTerm && (
            <div className="search-section">
              <div className="search-section-header">
                <span>Gợi ý tìm kiếm</span>
              </div>
              <div className="search-suggestions">
                <span
                  className="suggestion-tag"
                  onClick={() => handleRecentSearchClick("Nike")}
                >
                  Nike
                </span>
                <span
                  className="suggestion-tag"
                  onClick={() => handleRecentSearchClick("Adidas")}
                >
                  Adidas
                </span>
                <span
                  className="suggestion-tag"
                  onClick={() => handleRecentSearchClick("Kính mát")}
                >
                  Kính mát
                </span>
                <span
                  className="suggestion-tag"
                  onClick={() => handleRecentSearchClick("Giày thể thao")}
                >
                  Giày thể thao
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
