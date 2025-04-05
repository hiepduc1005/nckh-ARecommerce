import React from "react";

const FacebookLoginButton = ({ onClick }) => {
  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "40px",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    backgroundColor: "white",
    border: "1px solid #dadce0",
  };

  const contentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  };

  return (
    <button
      onClick={onClick}
      style={buttonStyle}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "#d2e3fc";
        e.currentTarget.style.background = "rgba(66, 133, 244, .04)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#dadce0";
        e.currentTarget.style.background = "#fff";
      }}
    >
      <div style={contentStyle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
        >
          <path
            fill="#1877F2"
            d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9 21.59 18.03 20.39 19.6 18.57C21.16 16.76 22.04 14.43 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
          />
        </svg>
        <span>Đăng nhập bằng Facebook</span>
      </div>
    </button>
  );
};

export default FacebookLoginButton;
