import React, { useEffect } from "react";
import "../assets/styles/components/WishList.scss";
import { useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

const WishListPopper = ({ isWishListOpen, wishlist }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Lấy giá tốt nhất (discountPrice nếu có, không thì price)
  const getBestPrice = (variant) => {
    return variant.discountPrice && variant.discountPrice < variant.price
      ? variant.discountPrice
      : variant.price;
  };

  // Tạo tên hiển thị cho sản phẩm với các thuộc tính
  const getDisplayName = (wishlistItem) => {
    const productName =
      wishlistItem.variantResponse?.productResponse?.productName || "Sản phẩm";
    const attributes =
      wishlistItem.variantResponse?.attributeValueResponses || [];

    if (attributes.length > 0) {
      const attributeString = attributes
        .map((attr) => attr.attributeValue)
        .join(", ");
      return `${productName} (${attributeString})`;
    }

    return productName;
  };

  return (
    <div className={`wishlist-popper ${!isWishListOpen ? "hidden" : ""}`}>
      <div className="wishlist-header">
        <Heart size={16} className="heart-icon" fill="currentColor" />
        Danh sách yêu thích
      </div>

      <div className="wishlist-content">
        {wishlist?.wishListItems?.length > 0 ? (
          <>
            <div className="wishlist-items">
              {wishlist.wishListItems.slice(0, 5).map((item) => (
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(
                      `/products/${item?.variantResponse?.productResponse?.slug}`
                    );
                  }}
                  key={item.id}
                  className="wishlist-item"
                >
                  <img
                    src={
                      `http://localhost:8080${item.variantResponse?.imagePath}` ||
                      "/default-image.jpg"
                    }
                    alt={getDisplayName(item)}
                    className="wishlist-image"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                  <div className="wishlist-details">
                    <span
                      className="wishlist-name"
                      title={getDisplayName(item)}
                    >
                      {getDisplayName(item)}
                    </span>
                    <div className="wishlist-price-container">
                      {(item.variantResponse?.discountPrice ||
                        item.variantResponse?.discountPrice > 0) &&
                      item.variantResponse.discountPrice <
                        item.variantResponse.price ? (
                        <>
                          <span className="wishlist-price-discount">
                            {formatPrice(item.variantResponse.discountPrice)}
                          </span>
                          <span className="wishlist-price-original">
                            {formatPrice(item.variantResponse.price)}
                          </span>
                        </>
                      ) : (
                        <span className="wishlist-price">
                          {formatPrice(item.variantResponse?.price || 0)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {wishlist.wishListItems.length > 5 && (
              <div className="more-items">
                và {wishlist.wishListItems.length - 5} sản phẩm khác...
              </div>
            )}
          </>
        ) : (
          <div className="empty-wishlist-message">
            <Heart size={32} className="empty-heart-icon" />
            <p>Chưa có sản phẩm yêu thích</p>
            <span>Thêm sản phẩm bạn yêu thích để xem tại đây</span>
          </div>
        )}
      </div>

      <div className="wishlist-footer">
        <button
          onClick={() => navigate("/wishlist")}
          className="wishlist-button"
          disabled={!wishlist?.wishListItems?.length}
        >
          <ShoppingCart size={16} />
          Xem tất cả ({wishlist?.wishListItems?.length || 0})
        </button>
      </div>
    </div>
  );
};

export default WishListPopper;
