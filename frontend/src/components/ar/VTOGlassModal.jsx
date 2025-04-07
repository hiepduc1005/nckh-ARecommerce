import React from "react";
import FaceDetection from "./FaceDetection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/modal/VTOGlassModal.scss";

const VTOGlassModal = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="vto-modal-overlay">
      <div className="vto-modal-container">
        <div className="vto-modal-content">
          <button className="vto-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="vto-modal-header">
            <h1>3D Glasses Overlay with Face Tracking</h1>
          </div>
          <div className="vto-modal-body">
            <div className="vto-main-content">
              <div className="vto-camera-container">
                <FaceDetection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VTOGlassModal;
