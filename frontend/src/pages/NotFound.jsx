import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng
import "../assets/styles/pages/NotFound.scss";

const NotFound = () => {
  useEffect(() => {
    document.title = "404";
  }, []);

  return (
    <div className="notfound">
      <div className="notfound-code">404</div>
      <div className="title">Page Not Found</div>
      <div className="content">Sorry, we couldn't find that page.</div>
      <Link to="/" className="back-home">
        Quay về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
