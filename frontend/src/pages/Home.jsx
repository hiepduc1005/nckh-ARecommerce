import React from 'react'
import ProductCarousel from '../components/ProductCarousel'
import glassImage from "../assets/images/glass-image.png"
import SaleProductCarousel from '../components/SaleProductCarousel';
const Home = () => {
  const categoryData = {
    title: "Kính Mắt",
    description: "Tổng hợp các mẫu kính nổi bật trong tháng vừa qua",
    image: glassImage
  };

  return (
    <div className='homepage-container' style={{padding: "0 80px"}}>
      <ProductCarousel category={categoryData} revertBanner = {false}/>
      <div className="break-line"></div>
      <ProductCarousel category={categoryData} revertBanner = {true}/>
      <div className="break-line"></div>
      <SaleProductCarousel />
    </div>
  )
}

export default Home