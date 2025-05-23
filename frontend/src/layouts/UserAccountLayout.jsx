import React, { useEffect } from "react";
import UserSideBar from "../components/UserSideBar";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import AdressFooter from "../components/AdressFooter";
import AIChatbox from "../components/AIChatBox,";

const UserAccountLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu useAuth() chưa sẵn sàng, không làm gì cả
    if (isAuthenticated === undefined || user === undefined) return;

    // Nếu chưa xác thực, điều hướng về login
    if (isAuthenticated === false || user === null) {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <AIChatbox />

      <Header />
      <div
        className="container"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          padding: "20px 0 40px",
        }}
      >
        <UserSideBar />
        <div
          className="content"
          style={{
            backgroundColor: "#f5f5f5",
            marginLeft: "20px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, .13)",
            borderRadius: "5px",
            flexGrow: "1",
          }}
        >
          <Outlet />
        </div>
      </div>
      <Footer />
      <AdressFooter />
    </>
  );
};

export default UserAccountLayout;
