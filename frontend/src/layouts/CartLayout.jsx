import React, { useEffect, useRef } from "react";
import AdressFooter from "../components/AdressFooter";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import CartPage from "../pages/CartPage";
import { useLocation } from "react-router-dom";

const CartLayout = () => {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <div ref={topRef}>
      <Header></Header>
      <CartPage />
      <Footer></Footer>
      <AdressFooter></AdressFooter>
    </div>
  );
};

export default CartLayout;
