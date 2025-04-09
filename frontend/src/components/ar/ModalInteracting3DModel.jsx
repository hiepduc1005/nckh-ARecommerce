import React, { useEffect, useState } from "react";
import Interactive3DViewer from "./Interactive3DViewer";
import "../../assets/styles/components/modal/ModalInteracting3DModel.scss";
import { useGLTF } from "@react-three/drei";
const ModalInteracting3DModel = ({
  isOpen,
  onClose,
  modelUrl,
  setConfig,
  config,
}) => {
  if (!isOpen || !modelUrl) return null;

  const [colorConfig, setColorConfig] = useState({});

  useEffect(() => {
    if (config) {
      setColorConfig(config);
    }
  }, [config]);

  const handleOnClose = () => {
    useGLTF.clear(modelUrl);
    setConfig(colorConfig);
    onClose();
  };

  return (
    <div className="fullscreen-modal">
      <div className="fullscreen-modal__content">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "15px 20px",
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
              Custom 3D Model Viewer
            </h2>
          </div>
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => handleOnClose()}
          >
            Done
          </button>
        </div>
        <div className="fullscreen-modal__body">
          <Interactive3DViewer
            modelUrl={modelUrl}
            setColorConfig={setColorConfig}
            colorConfig={colorConfig}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalInteracting3DModel;
