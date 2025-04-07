import React from "react";
import Interactive3DViewer from "../../pages/Test";

const ModalInteracting3DModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fullscreen-modal">
      <div className="fullscreen-modal__content">
        <button className="fullscreen-modal__close-button" onClick={onClose}>
          &times;
        </button>
        <div className="fullscreen-modal__body">
          <Interactive3DViewer modelUrl="/models/tim_nhat_837479.glb" />
        </div>
      </div>
    </div>
  );
};

export default ModalInteracting3DModel;
