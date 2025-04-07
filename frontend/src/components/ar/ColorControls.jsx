// ColorControls.jsx
import React, { useRef, useState, useEffect, Suspense } from "react";
import "../../assets/styles/components/ColorControls.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faUndo,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
const ColorControls = ({
  selectedPart,
  onColorChange,
  onNavigate,
  parts,
  setSelectedPart,
}) => {
  const colors = [
    "#000000", // Black
    "#a9b0ba", // Wolf Grey
    "#ffffff", // White
    "#f3e5ab", // Cream
    "#654321", // Brown
    "#e32b2b", // Red
    "#ff5722", // Orange
    "#ffc107", // Yellow/Gold
    "#4caf50", // Green
    "#2196f3", // Blue
    "#673ab7", // Purple
  ];

  const colorNames = {
    "#000000": "Black",
    "#a9b0ba": "Wolf Grey",
    "#ffffff": "White",
    "#f3e5ab": "Cream",
    "#654321": "Brown",
    "#e32b2b": "Red",
    "#ff5722": "Orange",
    "#ffc107": "Gold",
    "#4caf50": "Green",
    "#2196f3": "Blue",
    "#673ab7": "Purple",
  };

  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(1);

  //   const currentIndex = parts.findIndex(
  //     (item) => item?.uuid === selectedPart?.uuid
  //   );
  //   const totalItems = parts?.length || 1;

  useEffect(() => {
    const current = parts.findIndex(
      (item) => item?.uuid === selectedPart?.uuid
    );
    const total = parts?.length || 1;
    if (current !== -1 && current !== currentIndex) {
      setCurrentIndex(current);
    }
    setTotalItems(total);
  }, [parts, selectedPart, currentIndex]);

  const handleNavigate = (action) => {
    if (parts.length === 0) return;

    let newIndex;
    if (action === "prev") {
      newIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
    } else if (action === "next") {
      newIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex;
    }

    setCurrentIndex(newIndex);
    setSelectedPart(parts[newIndex]);
  };

  if (!selectedPart)
    return (
      <div className="color-controls">
        <div className="color-controls__nav">
          <button
            className="color-controls__nav-button"
            onClick={() => handleNavigate("prev")}
            disabled
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          <button
            className="color-controls__nav-button"
            onClick={() => handleNavigate("next")}
            disabled
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="color-controls__message">
          Click on a part of the model to select it
        </div>
      </div>
    );

  return (
    <div className="color-controls">
      <div className="color-controls__nav">
        <button
          className="color-controls__nav-button"
          onClick={() => handleNavigate("prev")}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="color-controls__nav-title">
          {selectedPart?.name} {currentIndex + 1}/{totalItems}
        </div>
        <button
          className="color-controls__nav-button"
          onClick={() => handleNavigate("next")}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
      <div className="color-controls__colors">
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => onColorChange(color)}
            className="color-controls__color-item"
            style={{
              backgroundColor: color,
              border: color === "#ffffff" ? "1px solid #e0e0e0" : "none",
            }}
          >
            {color === `#${selectedPart?.material?.color?.getHexString()}` && (
              <div className="color-controls__selected-indicator"></div>
            )}
          </div>
        ))}
      </div>

      <div className="color-controls__actions">
        <button
          onClick={() => onColorChange("reset")}
          className="color-controls__reset-button"
        >
          <FontAwesomeIcon
            icon={faUndo}
            className="color-controls__button-icon"
          />
          Reset
        </button>

        <button
          onClick={() => {
            if (window.captureScreenshot) window.captureScreenshot();
          }}
          className="color-controls__capture-button"
        >
          <FontAwesomeIcon
            icon={faCamera}
            className="color-controls__button-icon"
          />
          Capture Views
        </button>
      </div>
    </div>
  );
};

export default ColorControls;
