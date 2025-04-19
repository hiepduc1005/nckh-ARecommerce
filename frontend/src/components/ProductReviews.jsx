import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { formatToVNDate } from "../utils/ultils";
import "../assets/styles/components/ProductReviews.scss";

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

  useEffect(() => {
    fetchReviews();
  }, [productId, filter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Add filter parameter if not showing all ratings
      const params = filter > 0 ? { rating: filter } : {};

      //   const data = await getProductRatings(productId, params);
      setReviews(null || []);

      // If we're not filtering, update the stats
      if (filter === 0) {
        calculateStats(null || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    if (!reviewsData || reviewsData.length === 0) {
      setStats({
        average: 0,
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
      return;
    }

    const total = reviewsData.length;
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;

    // Count ratings by star level
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });

    setStats({
      average: parseFloat(average.toFixed(1)),
      total,
      distribution,
    });
  };

  const handleFilterChange = (starCount) => {
    setFilter(starCount);
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

  if (loading && !reviews.length) {
    return <div className="reviews-loading">Đang tải đánh giá...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  return (
    <div className="product-reviews">
      <div className="reviews-summary">
        <div className="summary-stats">
          <div className="average-rating">
            <span className="rating-value">{stats.average}</span>
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

      <div className="reviews-list">
        {reviews.length === 0 ? (
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
                    {review.user?.avatar ? (
                      <img
                        src={review.user.avatar}
                        alt={review.user.username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {review.user?.username?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="user-details">
                    <div className="username">
                      {review.user?.username || "Người dùng ẩn danh"}
                    </div>
                    <div className="review-date">
                      {formatToVNDate(review.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>

              <div className="review-content">
                <p>{review.comment}</p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((image, index) => (
                    <div key={index} className="review-image">
                      <img src={image} alt={`Review image ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {review.productVariant && (
                <div className="review-variant">
                  <span className="variant-label">Phân loại:</span>
                  <span className="variant-value">
                    {review.productVariant.variantName || "Mặc định"}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {reviews.length > 0 && (
        <div className="reviews-pagination">
          <button className="pagination-button" disabled>
            Trước
          </button>
          <span className="pagination-current">1</span>
          <button className="pagination-button">Sau</button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
