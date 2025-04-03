import React, { useState } from 'react';
import ReactStars from "react-rating-stars-component";
import '../assets/styles/components/ProductRating.scss';
import useAuth from '../hooks/UseAuth';
import { toast } from 'react-toastify';
import useLoading from '../hooks/UseLoading';
import { createRating } from '../api/ratingApi';

const ProductRating = ({ productId, existingRatings = []}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments,setComments] = useState([])
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {token,user,isAuthenticated} = useAuth()
  const {setLoading} = useLoading()

  
  // Calculate average rating
  const averageRating = existingRatings.length > 0 
    ? existingRatings.reduce((sum, item) => sum + item.ratingValue, 0) / existingRatings.length 
    : 0;
  
  // Handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    
    if (rating === 0) {
      toast.error('Please select a rating')
      setLoading(false)
      return;
    }
    setSubmitting(true);
    
    try {
      const ratingData = {
        productId,
        userId: user?.id,
        ratingValue: rating,
        comment
      };
      
      const data = await createRating(ratingData,token)
      if(data){
        setComments(prev => [...prev,data])
        toast.success("Thank for your review!")
      }
      setComment('');
      setRating(0);
    } catch (err) {
      toast.error("Failed to submit review!")
      console.error(err);
    } finally {
      setSubmitting(false);
      setLoading(false)
    }
  };
  
  return (
    <div className="product-rating-container">
      {/* Average Rating Display */}
      <div className="rating-summary">
        <div className="average-rating">
          <ReactStars
            count={5}
            value={averageRating}
            size={24}
            edit={false}
            isHalf={true}
            activeColor="#ffd700"
          />
          <span className="rating-value">{averageRating.toFixed(1)}</span>
          <span className="review-count">({existingRatings.length} {existingRatings.length === 1 ? 'review' : 'reviews'})</span>
        </div>
      </div>
      
      {/* Review Form */}
      <div className="rating-form-container">
        <h3 className="form-title">Write a Review</h3>       
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="form-group">
            <label className="form-label">Your Rating: {rating ? rating.toFixed(1) : '0.0'} / 5.0</label>
            <div className="interactive-stars">
              <ReactStars
                count={5}
                onChange={handleRatingChange}
                size={36}
                value={rating}
                isHalf={true}
                emptyIcon={<i className="far fa-star"></i>}
                halfIcon={<i className="fa fa-star-half-alt"></i>}
                fullIcon={<i className="fa fa-star"></i>}
                activeColor="#ffd700"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="comment" className="form-label">Your Review</label>
            <textarea
              id="comment"
              rows="4"
              className="comment-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`submit-button ${submitting ? 'submitting' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
      
      <div className="reviews-container">
        <h3 className="section-title">Customer Reviews</h3>
        {existingRatings.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="reviews-list">
            {existingRatings.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="stars-container">
                      {renderRatingStars(review.ratingValue)}
                    </div>
                    <span className="reviewer-name">{review.userResponse?.name || 'Anonymous'}</span>
                    {review.isVerified && (
                      <span className="verified-badge">Verified Purchase</span>
                    )}
                  </div>
                  <div className="review-date">
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRating;