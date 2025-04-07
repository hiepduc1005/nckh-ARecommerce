import { useProgress } from "@react-three/drei";
import React from "react";

const LoadingScreen = () => {
  const { progress, item, loaded, total } = useProgress();

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f0f0",
        zIndex: 1000,
        color: "#333",
      }}
    >
      <h2>Đang chuẩn bị mô hình 3D</h2>
      <div style={{ width: "300px", marginTop: "20px" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "8px",
            background: "#3498db",
            borderRadius: "4px",
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
      <p style={{ marginTop: "10px" }}>{Math.round(progress)}% hoàn thành</p>
      {item && (
        <p style={{ fontSize: "14px", opacity: 0.7 }}>Đang tải: {item}</p>
      )}
      <p style={{ fontSize: "14px", opacity: 0.7 }}>
        Đã tải: {loaded}/{total} tài nguyên
      </p>
    </div>
  );
};

export default LoadingScreen;
