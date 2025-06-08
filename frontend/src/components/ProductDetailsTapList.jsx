import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "../assets/styles/components/ProductDetailsTapList.scss";
import ProductReviews from "./ProductReviews";

const ProductDetailsTapList = ({ product }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="product-details-tab-list">
      <Tabs selectedIndex={activeTab} onSelect={handleTabSelect}>
        <TabList>
          <Tab>Mô tả</Tab>
          <Tab>Đánh giá</Tab>
        </TabList>

        <TabPanel>
          <div
            className="description-content"
            style={{ whiteSpace: "pre-line" }}
          >
            {product?.description ? (
              <p>{product.description}</p>
            ) : (
              <p className="no-description">
                Sản phẩm này chưa có mô tả chi tiết.
              </p>
            )}
          </div>
        </TabPanel>

        <TabPanel>
          <div className="reviews-content">
            {product?.id ? (
              <ProductReviews productId={product.id} />
            ) : (
              <div className="loading-reviews">
                Đang tải thông tin đánh giá...
              </div>
            )}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProductDetailsTapList;
