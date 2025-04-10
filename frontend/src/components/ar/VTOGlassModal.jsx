import React, { useEffect, useState } from "react";
import FaceDetection from "./FaceDetection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/modal/VTOGlassModal.scss";
import { trackARVTOSessionEnd } from "../../utils/analytics";

const VTOGlassModal = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  const [sessionStart, setSessionStart] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSessionStart(Date.now);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (sessionStart) {
      const duration = parseFloat(
        ((Date.now() - sessionStart) / 1000).toFixed(2)
      );
      trackARVTOSessionEnd(duration);
    }
    onClose();
  };

  return (
    <div className="vto-modal-overlay">
      <div className="vto-modal-container">
        <div className="vto-modal-content">
          <button className="vto-modal-close" onClick={() => handleClose()}>
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
