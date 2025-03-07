import React, { useEffect, useState } from 'react'
import "../assets/styles/pages/Home.scss"
import ProductCarousel from '../components/ProductCarousel'
import glassImage from "../assets/images/glass-image.png"
import SaleProductCarousel from '../components/SaleProductCarousel';
import useLoading from '../hooks/UseLoading';
import { getProductsPaginate } from '../api/productApi';
const Home = () => {
  const categoryData = {
    title: "Kính Mắt",
    description: "Tổng hợp các mẫu kính nổi bật trong tháng vừa qua",
    image: glassImage
  };

  const {setLoading} = useLoading();
  const [products,setProducts] = useState()

  useEffect(() => {
    setLoading(true)
    const fetchProducts = async () => {
      const data = await getProductsPaginate(1,8);
      setProducts(data.content);
      console.log(data)

    };
    fetchProducts();
    setLoading(false)
  }, []); 

  return (
    <>
      <div className='banner'></div>
      <div className='homepage-container' style={{padding: "0 80px"}}>
        <ProductCarousel category={categoryData} products={products} revertBanner = {false}/>
        <div className="break-line"></div>
        <ProductCarousel category={categoryData} products={products} revertBanner = {true}/>
        <div className="break-line"></div>
        <SaleProductCarousel products={products} />
      </div>
    </>
  )
}

export default Home