import React, { useState, useEffect } from "react";
import { Star, Upload, X } from "lucide-react";
import "../assets/styles/components/ProductRating.scss";
import { toast } from "react-toastify";
import useAuth from "../hooks/UseAuth";
import { createRating, getRatingByUserInProduct } from "../api/ratingApi";
import { formatCurrency } from "../utils/ultils";
const ProductRating = ({ order, product, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, token } = useAuth();

  useEffect(() => {
    const fetchRatingByUserInProduct = async () => {
      const data = await getRatingByUserInProduct(product.id, token);

      if (data) {
        setRating(data.ratingValue);
        setComment(data.comment);
        const listImagePreviews = data?.imagePaths?.map(
          (imagePath) => `http://localhost:8080${imagePath}`
        );
        setPreviewImages(listImagePreviews);
      }
    };

    if (token && product.id) {
      fetchRatingByUserInProduct();
    }
  }, [token, product]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh");
      return;
    }

    if (previewImages.length >= 5) {
      toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh");
      return;
    }

    setImages([...images, ...files]);

    // Create preview URLs
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };

  console.log(order);
  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...previewImages];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up URL object
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá");
      return;
    }

    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataRatingCreate = {
        productId: product.id,
        userId: user.id,
        ratingValue: rating,
        comment: comment,
      };
      const formData = new FormData();
      formData.append(
        "rating",
        new Blob([JSON.stringify(dataRatingCreate)], {
          type: "application/json",
        })
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      const data = createRating(formData, token);
      if (data) {
        setIsSubmitting(false);
        toast.success("Cảm ơn đánh giá của bạn");
        onClose();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setIsSubmitting(false);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.");
      onClose();
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, []);

  return (
    <div className="product-rating-modal">
      <div className="rating-modal-content">
        <div className="rating-modal-header">
          <h2>Đánh giá sản phẩm</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {order?.variants?.map((variant) => (
          <div
            key={
              variant.id || `${order.product.id}-${variant.variantResponse.id}`
            }
            className="order-item"
          >
            <div className="item-image">
              <img
                src={`http://localhost:8080${variant.variantResponse.imagePath}`}
                alt={order.product.productName}
              />
            </div>
            <div className="item-details">
              <div className="item-name">{order.product.productName}</div>
              <div className="item-variant">
                <span>
                  {variant.variantResponse.attributeValueResponses.map(
                    (attributeValue, index, array) => (
                      <span key={attributeValue.attributeName}>
                        {attributeValue.attributeName}:{" "}
                        <strong>{attributeValue.attributeValue}</strong>
                        {index < array.length - 1 ? " | " : ""}
                      </span>
                    )
                  ) || "Ngẫu nhiên"}
                </span>
              </div>
              <div className="item-quantity">x{variant.quantity}</div>
            </div>
            <div className="item-price">
              <div className="original-price">
                {formatCurrency(variant.variantResponse.price)}
              </div>
              <div className="discount-price">
                {formatCurrency(variant.variantResponse.discountPrice)}
              </div>
            </div>
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <div className="rating-stars">
            <p>Mức độ hài lòng:</p>
            <div className="stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  onClick={() => handleRatingChange(star)}
                  className={star <= rating ? "star filled" : "star"}
                  fill={star <= rating ? "#FFC107" : "none"}
                  stroke={star <= rating ? "#FFC107" : "#ccc"}
                />
              ))}
            </div>
            <p className="rating-text">
              {rating === 5
                ? "Rất hài lòng"
                : rating === 4
                ? "Hài lòng"
                : rating === 3
                ? "Bình thường"
                : rating === 2
                ? "Không hài lòng"
                : "Rất không hài lòng"}
            </p>
          </div>

          <div className="rating-comment">
            <textarea
              placeholder="Chia sẻ thêm đánh giá của bạn về sản phẩm này..."
              value={comment}
              onChange={handleCommentChange}
              rows={4}
            ></textarea>
          </div>

          <div className="rating-images">
            <p>Thêm hình ảnh (tối đa 5 ảnh):</p>
            <div className="images-container">
              {previewImages.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {previewImages.length < 5 && (
                <label className="upload-image-label">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="upload-input"
                  />
                  <div className="upload-placeholder">
                    <Upload size={24} />
                    <span>Tải ảnh</span>
                  </div>
                </label>
              )}
            </div>
            <p className="image-limit-text">
              {previewImages.length}/5 ảnh đã tải lên
            </p>
          </div>

          <div className="rating-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductRating;
