// SkeletonLoader.jsx
import React from "react";
import "../assets/styles/components/SkeletonLoader.scss";

const SkeletonBox = ({ width = "100%", height = "20px", className = "" }) => (
  <div className={`skeleton-box ${className}`} style={{ width, height }} />
);

const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="grid-item skeleton-item">
          <div className="product-image skeleton-product-image">
            <SkeletonBox width="100%" height="200px" />
            <div className="product-actions skeleton-actions">
              <SkeletonBox
                width="32px"
                height="32px"
                className="skeleton-circle"
              />
              <SkeletonBox
                width="32px"
                height="32px"
                className="skeleton-circle"
              />
              <SkeletonBox
                width="32px"
                height="32px"
                className="skeleton-circle"
              />
            </div>
          </div>
          <div className="product-details skeleton-details">
            <SkeletonBox width="80%" height="20px" className="skeleton-title" />
            <div className="product-price skeleton-price">
              <SkeletonBox width="60px" height="18px" />
              <SkeletonBox width="50px" height="16px" />
            </div>
            <div className="product-rating skeleton-rating">
              <SkeletonBox width="80px" height="16px" />
              <SkeletonBox width="30px" height="14px" />
            </div>
            <SkeletonBox width="100%" height="14px" />
            <SkeletonBox width="70%" height="14px" />
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductListSkeleton = ({ count = 8 }) => {
  return (
    <div className="product-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="list-item skeleton-item">
          <div className="product-image skeleton-list-image">
            <SkeletonBox width="150px" height="150px" />
          </div>
          <div className="product-info skeleton-list-info">
            <SkeletonBox width="70%" height="22px" className="skeleton-title" />
            <div className="product-price skeleton-price">
              <SkeletonBox width="80px" height="20px" />
              <SkeletonBox width="70px" height="18px" />
            </div>
            <div className="product-rating skeleton-rating">
              <SkeletonBox width="100px" height="16px" />
              <SkeletonBox width="40px" height="14px" />
            </div>
            <SkeletonBox width="100%" height="14px" />
            <SkeletonBox width="85%" height="14px" />
            <SkeletonBox width="60%" height="14px" />

            <div className="product-attributes skeleton-attributes">
              <div className="attributes">
                <div className="attribute">
                  <SkeletonBox width="80px" height="14px" />
                  <SkeletonBox width="120px" height="14px" />
                </div>
                <div className="attribute">
                  <SkeletonBox width="60px" height="14px" />
                  <SkeletonBox width="100px" height="14px" />
                </div>
              </div>
            </div>

            <div className="product-actions skeleton-list-actions">
              <SkeletonBox width="120px" height="36px" />
              <SkeletonBox width="100px" height="36px" />
              <SkeletonBox width="80px" height="36px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CheckBoxListSkeleton = ({ title, count = 5 }) => {
  return (
    <div className="checkbox-list-skeleton">
      <h3 className="skeleton-filter-title">{title}</h3>
      <div className="skeleton-checkboxes">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-checkbox-item">
            <SkeletonBox
              width="16px"
              height="16px"
              className="skeleton-checkbox"
            />
            <SkeletonBox width={`${Math.random() * 50 + 50}%`} height="16px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export {
  ProductGridSkeleton,
  ProductListSkeleton,
  CheckBoxListSkeleton,
  SkeletonBox,
};
