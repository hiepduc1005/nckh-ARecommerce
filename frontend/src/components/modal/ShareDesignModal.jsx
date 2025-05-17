import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faPinterestP,
} from "@fortawesome/free-brands-svg-icons";
import { faTimes, faCopy } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/modal/ShareDesignModal.scss";
import { toast } from "react-toastify";

const ShareDesignModal = ({ isOpen, onClose, design, modelName }) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    const designUrl = `${window.location.origin}/share-design/${design.id}`;
    navigator.clipboard.writeText(designUrl);
    toast.success("Link copied to clipboard!");
  };

  const shareFacebook = () => {
    const designUrl = `${window.location.origin}/share-design/${design.id}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        designUrl
      )}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    const designUrl = `${window.location.origin}/share-design/${design.id}`;
    const text = `Check out my custom design for ${modelName}!`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(designUrl)}`,
      "_blank"
    );
  };

  const sharePinterest = () => {
    const designUrl = `${window.location.origin}/share-design/${design.id}`;
    const media = `${window.location.origin}${design.imagePath}`;
    const description = `Custom ${modelName} design`;
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        designUrl
      )}&media=${encodeURIComponent(media)}&description=${encodeURIComponent(
        description
      )}`,
      "_blank"
    );
  };

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-content">
        <button className="close-button" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="share-modal-header">
          <h2>Share Your Design</h2>
          <p>{modelName}</p>
        </div>

        <div className="share-modal-image">
          <img
            src={`http://localhost:8080${design.imagePath}`}
            alt="Design to share"
          />
        </div>

        <div className="share-buttons">
          <button className="share-btn facebook" onClick={shareFacebook}>
            <FontAwesomeIcon icon={faFacebookF} />
          </button>
          <button className="share-btn twitter" onClick={shareTwitter}>
            <FontAwesomeIcon icon={faTwitter} />
          </button>
          <button className="share-btn pinterest" onClick={sharePinterest}>
            <FontAwesomeIcon icon={faPinterestP} />
          </button>
        </div>

        <button className="copy-link-button" onClick={handleCopyLink}>
          <FontAwesomeIcon icon={faCopy} /> Copy Link
        </button>
      </div>
    </div>
  );
};

export default ShareDesignModal;
