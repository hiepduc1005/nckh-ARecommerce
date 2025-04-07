import React, { useEffect, useState } from "react";
import "../assets/styles/pages/Home.scss";
import ProductCarousel from "../components/ProductCarousel";
import glassImage from "../assets/images/glass-image.png";
import SaleProductCarousel from "../components/SaleProductCarousel";
import useLoading from "../hooks/UseLoading";
import { getProductsPaginate } from "../api/productApi";
import { Link } from "react-router-dom";

const Home = () => {
  const categoryData = {
    title: "Kính Mắt",
    description: "Tổng hợp các mẫu kính nổi bật trong tháng vừa qua",
    image: glassImage,
  };

  const { setLoading } = useLoading();
  const [products, setProducts] = useState();

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      const data = await getProductsPaginate(1, 8);
      setProducts(data.content);
    };
    fetchProducts();
    setLoading(false);
  }, []);

  return (
    <>
      <div className="banner"></div>

      {/* Customize CTA Section */}
      <div className="customize-cta-container">
        <div className="customize-cta-content">
          <h2>Thiết Kế Sản Phẩm Của Riêng Bạn</h2>
          <p>
            Tự do sáng tạo với công cụ customize độc đáo cho giày và kính mắt
          </p>
          <div className="customize-buttons">
            <Link to="/customize/glasses" className="customize-button glasses">
              <span className="icon">👓</span>
              Customize Kính Mắt
            </Link>
            <Link to="/customize/shoes" className="customize-button shoes">
              <span className="icon">👟</span>
              Customize Giày
            </Link>
          </div>
        </div>
        <div className="customize-cta-images">
          <div className="customize-image glasses"></div>
          <div className="customize-image shoes"></div>
        </div>
      </div>

      <div className="homepage-container" style={{ padding: "0 80px" }}>
        <ProductCarousel
          category={categoryData}
          products={products}
          revertBanner={false}
        />
        <div className="break-line"></div>
        <ProductCarousel
          category={categoryData}
          products={products}
          revertBanner={true}
        />
        <div className="break-line"></div>
        <SaleProductCarousel products={products} />
      </div>
    </>
  );
};

export default Home;
