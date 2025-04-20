import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { formatToVNDate } from "../utils/ultils";
import "../assets/styles/components/ProductReviews.scss";
import { getRatingsPaginate } from "../api/ratingApi";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [filter, setFilter] = useState(0); // 0 means all ratings
  const [currentPage, setCurrentPage] = useState(0); // Page is 0-indexed for API
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const size = 5; // Number of reviews per page

  useEffect(() => {
    // Reset to first page when filter changes
    setCurrentPage(0);
    fetchReviews();
  }, [productId, filter]);

  // Separate effect for page changes to avoid resetting page on initial load
  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = filter > 0 ? filter : 0;
      const response = await getRatingsPaginate(
        productId,
        currentPage,
        size,
        params
      );

      if (response) {
        // Extract the reviews from the ratings page data
        if (response.ratings && response.ratings.content) {
          setReviews(response.ratings.content);
          setTotalPages(response.ratings.totalPages);
          setTotalElements(response.total);
        } else {
          setReviews([]);
          setTotalPages(0);
          setTotalElements(0);
        }

        const normalizedDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        if (response.distribution) {
          Object.entries(response.distribution).forEach(([star, count]) => {
            normalizedDistribution[parseInt(star)] = count;
          });
        }
        const newStats = {
          average: response.average || 0,
          total: response.total || 0,
          distribution: normalizedDistribution,
        };
        setStats(newStats);
      } else {
        setReviews([]);
        setTotalPages(0);
        setTotalElements(0);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (starCount) => {
    setFilter(starCount);
    // Reset to first page when filter changes
    setCurrentPage(0);
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of page buttons to show

    // Calculate range of pages to display
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-button"
        onClick={goToPreviousPage}
        disabled={currentPage === 0}
      >
        Trước
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${currentPage === i ? "active" : ""}`}
          onClick={() => goToPage(i)}
        >
          {i + 1}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-button"
        onClick={goToNextPage}
        disabled={currentPage === totalPages - 1 || totalPages === 0}
      >
        Sau
      </button>
    );

    return pages;
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          size={16}
          className={index < rating ? "star filled" : "star"}
          fill={index < rating ? "#FFC107" : "none"}
          stroke={index < rating ? "#FFC107" : "#ccc"}
        />
      ));
  };

  return (
    <div className="product-reviews">
      <div className="reviews-summary">
        <div className="summary-stats">
          <div className="average-rating">
            <span className="rating-value">{stats.average.toFixed(1)}</span>
            <span className="rating-max">/5</span>
          </div>
          <div className="star-display">
            {renderStars(Math.round(stats.average))}
          </div>
          <div className="total-reviews">{stats.total} đánh giá</div>
        </div>

        <div className="rating-distribution">
          {Object.entries(stats.distribution)
            .sort((a, b) => b[0] - a[0]) // Sort by star count (5 to 1)
            .map(([stars, count]) => {
              const percentage = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <div
                  key={stars}
                  className="rating-bar"
                  onClick={() => handleFilterChange(parseInt(stars))}
                >
                  <div className="stars-label">
                    {stars} {stars === "1" ? "sao" : "sao"}
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="count-label">{count}</div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="reviews-filter">
        <span className="filter-label">Lọc theo:</span>
        <div className="filter-buttons">
          <button
            className={filter === 0 ? "active" : ""}
            onClick={() => handleFilterChange(0)}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              className={filter === star ? "active" : ""}
              onClick={() => handleFilterChange(star)}
            >
              {star} sao
            </button>
          ))}
        </div>
        {filter > 0 && (
          <div className="filter-active">
            <span>Đang lọc: {filter} sao</span>
            <button
              className="clear-filter"
              onClick={() => handleFilterChange(0)}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {loading && <div className="reviews-loading">Đang tải đánh giá...</div>}

      {error && <div className="reviews-error">{error}</div>}

      <div className="reviews-list">
        {!loading && reviews.length === 0 ? (
          <div className="no-reviews">
            {filter > 0
              ? `Không có đánh giá ${filter} sao nào.`
              : "Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!"}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="user-info">
                  <div className="user-avatar">
                    {review.userResponse?.avatar ? (
                      <img
                        src={review.userResponse.avatar}
                        alt={review.userResponse.username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {review.userResponse?.username?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="username">
                      {review.userResponse?.username || "Người dùng ẩn danh"}
                    </div>
                    <div className="review-date">
                      {formatToVNDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.ratingValue)}
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              {review.imagePaths && review.imagePaths.length > 0 && (
                <div className="review-images">
                  {review.imagePaths.map((image, index) => (
                    <div key={index} className="review-image">
                      <img
                        src={`http://localhost:8080${image}`}
                        alt={`Review image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {!loading && reviews.length > 0 && totalPages > 1 && (
        <div className="reviews-pagination">{renderPagination()}</div>
      )}
    </div>
  );
};

export default ProductReviews;
