import React, { useEffect, useState } from "react";
import "../assets/styles/pages/ShoesCustomize.scss";
import { getModelsByType } from "../api/modelCustomize";
import { Link } from "react-router-dom";

const ShoesCustomize = () => {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    document.title = "Danh sách giày tùy chỉnh | HHQTV Store";
  }, []);

  useEffect(() => {
    fetchShoes();
  }, [page, size]);

  const fetchShoes = async () => {
    try {
      setLoading(true);
      const response = await getModelsByType(page, size, "SHOE");
      setShoes(response?.content);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load shoes. Please try again later.");
      setLoading(false);
      console.error("Error fetching shoes:", err);
    }
  };

  const toggleViewMode = (mode) => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderGridView = () => (
    <div className="shoes-grid">
      {shoes.map((shoe) => (
        <div key={shoe.id} className="shoe-card">
          <div className="shoe-image-container">
            <img
              src={
                `http://localhost:8080${shoe.imagePath}` ||
                "/api/placeholder/250/200"
              }
              alt={shoe.name}
              className="shoe-image"
            />
            <div className="customize-overlay">
              <Link to={`/customize/${shoe.id}`} className="customize-button">
                Customize
              </Link>
            </div>
          </div>
          <div className="shoe-info">
            <h3 className="shoe-name">{shoe.name}</h3>
            <div className="shoe-details">
              <span className="shoe-price">${shoe.price}</span>
              <Link to={`/customize/${shoe.id}`} className="details-button">
                Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="shoes-list">
      {shoes.map((shoe) => (
        <div key={shoe.id} className="shoe-list-item">
          <div className="shoe-list-image">
            <img
              src={
                `http://localhost:8080${shoe.imagePath}` ||
                "/api/placeholder/250/200"
              }
              alt={shoe.name}
            />
            <div className="list-customize-overlay">
              <Link
                to={`/customize/${shoe.id}`}
                className="list-customize-button"
              >
                Customize
              </Link>
            </div>
          </div>
          <div className="shoe-list-info">
            <div className="shoe-list-header">
              <div>
                <h3 className="shoe-list-name">{shoe.name}</h3>
                <p className="shoe-list-price">${shoe.price}</p>
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
        <p>Loading shoes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchShoes} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="shoes-list-page">
      <h1 className="page-title">Shoes Customization</h1>

      <div className="page-intro">
        <div className="intro-text">
          <h2 className="intro-title">Select a Shoe Model to Customize</h2>
          <p className="intro-description">
            Click on any shoe below to start your 3D customization experience.
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

      {shoes.length > 0 ? (
        <>
          {viewMode === "grid" ? renderGridView() : renderListView()}
          {renderPagination()}
        </>
      ) : (
        <div className="no-shoes-message">
          <p>No shoes found. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default ShoesCustomize;
