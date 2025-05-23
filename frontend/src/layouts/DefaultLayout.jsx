import React, { useEffect, useRef } from "react";
import Header from "./header/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer/Footer";
import RegisterToRecive from "../components/RegisterToRecive";
import AdressFooter from "../components/AdressFooter";
import EnsureSafety from "../components/EnsureSafety";
import UserRate from "../components/UserRate";
import AIChatbox from "../components/AIChatBox,";

const DefaultLayout = () => {
  const topRef = useRef(null);
  const location = useLocation();

  // Scroll to top when location changes or on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return (
    <div ref={topRef}>
      <AIChatbox />

      <Header></Header>
      <Outlet></Outlet>
      <UserRate />
      <EnsureSafety />
      <RegisterToRecive />
      <Footer></Footer>
      <AdressFooter></AdressFooter>
    </div>
  );
};

export default DefaultLayout;
