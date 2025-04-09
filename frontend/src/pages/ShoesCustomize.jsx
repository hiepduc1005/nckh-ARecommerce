import React, { useState } from "react";
import "../assets/styles/pages/ShoesCustomize.scss";

const ShoesCustomize = () => {
  const [selectedShoe, setSelectedShoe] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Sample shoe data
  const shoes = [
    {
      id: 1,
      name: "Air Max",
      price: "$120",
      image: "/api/placeholder/250/200",
      color: "blue",
      description: "Classic design with maximum comfort and air cushioning.",
    },
    {
      id: 2,
      name: "Jordan Retro",
      price: "$180",
      image: "/api/placeholder/250/200",
      color: "red",
      description:
        "Iconic basketball shoes with premium materials and stylish design.",
    },
    {
      id: 3,
      name: "Classic Runner",
      price: "$90",
      image: "/api/placeholder/250/200",
      color: "green",
      description: "Lightweight running shoes perfect for daily training.",
    },
    {
      id: 4,
      name: "Sport Elite",
      price: "$135",
      image: "/api/placeholder/250/200",
      color: "purple",
      description:
        "Performance-focused athletic shoes with responsive cushioning.",
    },
    {
      id: 5,
      name: "Urban Style",
      price: "$110",
      image: "/api/placeholder/250/200",
      color: "yellow",
      description:
        "Street-inspired design with modern aesthetics for everyday wear.",
    },
    {
      id: 6,
      name: "Performance Pro",
      price: "$150",
      image: "/api/placeholder/250/200",
      color: "pink",
      description: "Professional-grade sports shoes with advanced technology.",
    },
    {
      id: 7,
      name: "Street Fashion",
      price: "$95",
      image: "/api/placeholder/250/200",
      color: "indigo",
      description: "Trendy casual shoes that blend comfort and style.",
    },
    {
      id: 8,
      name: "Outdoor Trail",
      price: "$145",
      image: "/api/placeholder/250/200",
      color: "orange",
      description:
        "Durable hiking shoes with excellent traction for outdoor adventures.",
    },
  ];

  const selectShoe = (shoe) => {
    setSelectedShoe(shoe);
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const renderGridView = () => (
    <div className="shoes-grid">
      {shoes.map((shoe) => (
        <div
          key={shoe.id}
          onClick={() => selectShoe(shoe)}
          className="shoe-card"
        >
          <div className="shoe-image-container">
            <img src={shoe.image} alt={shoe.name} className="shoe-image" />
            <div className="customize-overlay">
              <span className="customize-button">Customize</span>
            </div>
          </div>
          <div className="shoe-info">
            <h3 className="shoe-name">{shoe.name}</h3>
            <div className="shoe-details">
              <span className="shoe-price">{shoe.price}</span>
              <button className="details-button">Details</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="shoes-list">
      {shoes.map((shoe) => (
        <div
          key={shoe.id}
          onClick={() => selectShoe(shoe)}
          className="shoe-list-item"
        >
          <div className="shoe-list-image">
            <img src={shoe.image} alt={shoe.name} />
            <div className="list-customize-overlay">
              <span className="list-customize-button">Customize</span>
            </div>
          </div>
          <div className="shoe-list-info">
            <div className="shoe-list-header">
              <div>
                <h3 className="shoe-list-name">{shoe.name}</h3>
                <p className="shoe-list-price">{shoe.price}</p>
              </div>
            </div>
            <p className="shoe-list-description">{shoe.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCustomizationView = () => (
    <div className="customization-view">
      <div className="customization-header">
        <h2 className="customization-title">
          Customizing: {selectedShoe.name}
        </h2>
        <button onClick={() => setSelectedShoe(null)} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Selection
        </button>
      </div>

      <div className="customization-container">
        <div className="model-container">
          <div className={`model-placeholder ${selectedShoe.color}`}>
            <p>3D Model Placeholder</p>
          </div>
        </div>
        <div className="options-container">
          <h3 className="options-title">{selectedShoe.name}</h3>
          <p className="options-price">Base Price: {selectedShoe.price}</p>
          <p className="options-description">{selectedShoe.description}</p>

          <div className="customization-options">
            <h4 className="options-subtitle">Color Options:</h4>
            <div className="color-options">
              <button className="color-option red"></button>
              <button className="color-option blue"></button>
              <button className="color-option green"></button>
              <button className="color-option yellow"></button>
              <button className="color-option purple"></button>
            </div>

            <h4 className="options-subtitle">Material:</h4>
            <div className="material-options">
              <button className="material-option">Leather</button>
              <button className="material-option">Canvas</button>
              <button className="material-option">Synthetic</button>
            </div>

            <button className="save-button">Save Customization</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="shoes-customize">
      <h1 className="page-title">Shoes Customization</h1>

      {!selectedShoe && (
        <>
          <div className="page-intro">
            <div className="intro-text">
              <h2 className="intro-title">Select a Shoe Model to Customize</h2>
              <p className="intro-description">
                Click on any shoe below to start your 3D customization
                experience.
              </p>
            </div>
            <div className="view-toggle">
              <button
                onClick={() => toggleViewMode("grid")}
                className={`toggle-button ${
                  viewMode === "grid" ? "active" : ""
                }`}
                aria-label="Grid view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => toggleViewMode("list")}
                className={`toggle-button ${
                  viewMode === "list" ? "active" : ""
                }`}
                aria-label="List view"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" x2="21" y1="6" y2="6" />
                  <line x1="8" x2="21" y1="12" y2="12" />
                  <line x1="8" x2="21" y1="18" y2="18" />
                  <line x1="3" x2="3.01" y1="6" y2="6" />
                  <line x1="3" x2="3.01" y1="12" y2="12" />
                  <line x1="3" x2="3.01" y1="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {viewMode === "grid" ? renderGridView() : renderListView()}
        </>
      )}

      {selectedShoe && renderCustomizationView()}
    </div>
  );
};

export default ShoesCustomize;
