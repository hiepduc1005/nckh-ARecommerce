import React, { useState } from "react";
import { Heart, Trash2, ShoppingCart, Grid, List } from "lucide-react";
import "../assets/styles/pages/WishlistPage.scss";
import { useWishlist } from "../hooks/UseWishList";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlistData } = useWishlist();
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'price-high', 'price-low'
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getSortedItems = () => {
    if (!wishlist?.wishListItems) return [];

    const items = [...wishlist.wishListItems];

    switch (sortBy) {
      case "oldest":
        return items.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      case "price-high":
        return items.sort(
          (a, b) =>
            (b.variantResponse.discountPrice || b.variantResponse.price) -
            (a.variantResponse.discountPrice || a.variantResponse.price)
        );
      case "price-low":
        return items.sort(
          (a, b) =>
            (a.variantResponse.discountPrice || a.variantResponse.price) -
            (b.variantResponse.discountPrice || b.variantResponse.price)
        );
      default: // newest
        return items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
  };

  const handleClearWishlist = () => {
    clearWishlistData();
    setShowClearConfirm(false);
  };

  const WishlistItem = ({ item, isListView = false }) => {
    const { variantResponse } = item;
    const hasDiscount =
      variantResponse.discountPrice > 0 &&
      variantResponse.discountPrice < variantResponse.price;
    const finalPrice = variantResponse.discountPrice || variantResponse.price;
    const discountPercent = hasDiscount
      ? Math.round(
          (1 - variantResponse.discountPrice / variantResponse.price) * 100
        )
      : 0;

    return (
      <div
        className={`wishlist-item ${isListView ? "list-view" : "grid-view"}`}
      >
        <div className="item-image">
          <img
            src={`http://localhost:8080${variantResponse.imagePath}`}
            alt={variantResponse.productResponse.name}
            onError={(e) => {
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
            }}
          />
          {hasDiscount && (
            <span className="discount-badge">-{discountPercent}%</span>
          )}
          <div className="item-actions">
            <button
              className="action-btn remove-btn"
              onClick={() => removeFromWishlist(variantResponse.id)}
              title="Xóa khỏi danh sách yêu thích"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="item-info">
          <div className="item-header">
            <h3 className="item-title">
              {variantResponse.productResponse.productName}
            </h3>
            <span className="item-brand">
              {variantResponse.productResponse.brandResponse.name}
            </span>
          </div>

          <div className="item-attributes">
            {variantResponse.attributeValueResponses.map((attr) => (
              <span key={attr.id} className="attribute-tag">
                {attr.attributeName}: {attr.attributeValue}
              </span>
            ))}
          </div>

          <div className="item-price">
            <span className="current-price">{formatPrice(finalPrice)}</span>
            {hasDiscount && (
              <span className="original-price">
                {formatPrice(variantResponse.price)}
              </span>
            )}
          </div>

          <div className="item-meta">
            <span className="added-date">
              Thêm vào: {formatDate(item.addedAt)}
            </span>
            <span
              className={`stock-status ${
                variantResponse.quantity > 0 ? "in-stock" : "out-of-stock"
              }`}
            >
              {variantResponse.quantity > 0
                ? `Còn ${variantResponse.quantity} sản phẩm`
                : "Hết hàng"}
            </span>
          </div>

          <button
            className="add-to-cart-btn"
            disabled={variantResponse.quantity === 0}
          >
            <ShoppingCart size={16} />
            {variantResponse.quantity > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </button>
        </div>
      </div>
    );
  };

  const sortedItems = getSortedItems();

  return (
    <div className="wishlist-page">
      <div className="page-header">
        <div></div>
        {sortedItems.length > 0 && (
          <div className="header-actions">
            <button
              className="clear-btn"
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 size={16} />
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {sortedItems.length > 0 ? (
        <>
          <div className="controls">
            <div className="view-controls">
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={20} />
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={20} />
                </button>
              </div>

              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-high">Giá cao đến thấp</option>
                <option value="price-low">Giá thấp đến cao</option>
              </select>
            </div>

            <span className="items-count">{sortedItems.length} sản phẩm</span>
          </div>

          <div
            className={viewMode === "grid" ? "wishlist-grid" : "wishlist-list"}
          >
            {sortedItems.map((item) => (
              <WishlistItem
                key={item.id}
                item={item}
                isListView={viewMode === "list"}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Heart className="heart-icon" />
          <h3>Danh sách yêu thích trống</h3>
          <p>Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
        </div>
      )}

      {showClearConfirm && (
        <div className="confirm-modal">
          <div className="confirm-content">
            <h3>Xác nhận xóa</h3>
            <p>
              Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu
              thích?
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-btn danger"
                onClick={handleClearWishlist}
              >
                Xóa tất cả
              </button>
              <button
                className="confirm-btn secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
