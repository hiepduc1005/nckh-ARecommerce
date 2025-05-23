import React, { useEffect, useRef } from "react";
import Sidebar from "../components/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/Header";
import EnsureSafety from "../components/EnsureSafety";
import RegisterToRecive from "../components/RegisterToRecive";
import Footer from "./footer/Footer";
import AdressFooter from "../components/AdressFooter";
import AIChatbox from "../components/AIChatBox,";

const ProductLayout = () => {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={topRef}>
      <AIChatbox />

      <Header />
      <Outlet />
      <EnsureSafety />
      <RegisterToRecive />
      <Footer />
      <AdressFooter />
    </div>
  );
};

export default ProductLayout;
