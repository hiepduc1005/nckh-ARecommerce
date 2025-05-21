import React, { useEffect, useState } from "react";
import "../assets/styles/pages/GlassesCustomize.scss";
import { getModelsByType } from "../api/modelCustomize";
import { Link } from "react-router-dom";

const GlassesCustomize = () => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [glasses, setGlasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchGlasses();
  }, [page, size]);

  const fetchGlasses = async () => {
    try {
      setLoading(true);
      const response = await getModelsByType(page, size, "GLASSES");
      setGlasses(response?.content);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load glasses. Please try again later.");
      setLoading(false);
      console.error("Error fetching glasses:", err);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderGridView = () => (
    <div className="glasses-grid">
      {glasses.map((glasses) => (
        <div key={glasses.id} className="glasses-card">
          <div className="glasses-image-container">
            <img
              src={
                `http://localhost:8080${glasses.imagePath}` ||
                "/api/placeholder/250/200"
              }
              alt={glasses.name}
              className="glasses-image"
            />
            <div className="customize-overlay">
              <Link
                to={`/customize/${glasses.id}`}
                className="customize-button"
              >
                Customize
              </Link>
            </div>
          </div>
          <div className="glasses-info">
            <h3 className="glasses-name">{glasses.name}</h3>
            <div className="glasses-details">
              <span className="glasses-price">${glasses.price}</span>
              <Link to={`/customize/${glasses.id}`} className="details-button">
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="glasses-list">
      {glasses.map((glasses) => (
        <div key={glasses.id} className="glasses-list-item">
          <div className="glasses-list-image">
            <img
              src={
                `http://localhost:8080${glasses.imagePath}` ||
                "/api/placeholder/250/200"
              }
              alt={glasses.name}
            />
            <div className="list-customize-overlay">
              <Link
                to={`/customize/${glasses.id}`}
                className="list-customize-button"
              >
                Customize
              </Link>
            </div>
          </div>
          <div className="glasses-list-info">
            <div className="glasses-list-header">
              <div>
                <h3 className="glasses-list-name">{glasses.name}</h3>
                <p className="glasses-list-price">${glasses.price}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 0}
        className="pagination-button"
      >
        Previous
      </button>
      <span className="page-info">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading glasses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchGlasses} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="glasses-list-page">
      <h1 className="page-title">Glasses Customization</h1>

      <div className="page-intro">
        <div className="intro-text">
          <h2 className="intro-title">Select a Glasses Model to Customize</h2>
          <p className="intro-description">
            Click on any glasses below to start your 3D customization
            experience.
          </p>
        </div>
        <div className="view-toggle">
          <button
            onClick={() => toggleViewMode("grid")}
            className={`toggle-button ${viewMode === "grid" ? "active" : ""}`}
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
            className={`toggle-button ${viewMode === "list" ? "active" : ""}`}
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

      {glasses.length > 0 ? (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}
          {renderPagination()}
        </>
      ) : (
        <div className="no-glasses-message">
          <p>No glasses found. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default GlassesCustomize;
