import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalInteracting3DModel from "../components/ar/ModalInteracting3DModel";
import "../assets/styles/pages/CustomizeDetails.scss";
import {
  getModelCustomizeById,
  getModelsDesignBySessionId,
} from "../api/modelCustomize";

const CustomizeDetails = () => {
  const { customizeId } = useParams();
  const [customizeModel, setCustomizeModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({});
  const [userDesigns, setUserDesigns] = useState([]);
  const [designsLoading, setDesignsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomizeModel = async () => {
      try {
        setLoading(true);
        // Using the function to get customize model by ID
        const response = await getModelCustomizeById(customizeId);
        if (!response) {
          navigate("notfound");
          return;
        }
        setCustomizeModel(response);
      } catch (err) {
        setError("Failed to load the customize model. Please try again later.");
        console.error("Error fetching model:", err);
      } finally {
        setLoading(false);
      }
    };

    if (customizeId) {
      fetchCustomizeModel();
    }
  }, [customizeId, navigate]);

  useEffect(() => {
    console.log(config);
  }, [config]);

  const fetchUserDesigns = async () => {
    try {
      setDesignsLoading(true);
      const sessionId = localStorage.getItem("sessionId");

      if (!sessionId) {
        console.log("No session ID found");
        return;
      }

      const response = await getModelsDesignBySessionId(0, 10, sessionId);
      if (response && response.content) {
        setUserDesigns(response.content);
      }
    } catch (err) {
      console.error("Error fetching user designs:", err);
    } finally {
      setDesignsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current config in CustomizeDetails:", config);
  }, [config]);

  const handleOpenModal = () => {
    // Open the modal with current config
    setIsModalOpen(true);
  };

  const handleOnSave = (updatedConfig) => {
    // Update the local state
    setConfig(updatedConfig);

    // After saving the design, refresh the user designs
    fetchUserDesigns();

    // Close the modal
    setIsModalOpen(false);
  };

  const handleCloseModal = (updatedConfig) => {
    // Update the config with what came from the modal
    if (updatedConfig) {
      setConfig(updatedConfig);
    }

    // Close the modal
    setIsModalOpen(false);

    // Refresh user designs after closing modal
    fetchUserDesigns();
  };
  // We've integrated the loading functionality directly in the onClick handler

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  if (!customizeModel) {
    return (
      <div className="not-found-container">
        <p>Model not found</p>
        <button className="back-button" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="customize-details-container">
      <div className="product-card">
        <div className="product-content">
          {/* Product Image */}
          <div className="product-image-container">
            <img
              src={
                `http://localhost:8080${customizeModel.imagePath}` ||
                "/placeholder-image.jpg"
              }
              alt={customizeModel.name}
              className="product-image"
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{customizeModel.name}</h1>
            <p className="product-price">${customizeModel.price?.toFixed(2)}</p>
            <p className="product-type">Type: {customizeModel.itemType}</p>
            <p className="product-date">
              Created: {new Date(customizeModel.createdAt).toLocaleDateString()}
            </p>

            {/* User's Previous Designs Section - Inside product info */}
            <div className="product-designs">
              <h3 className="designs-label">Customized Designs:</h3>

              {designsLoading ? (
                <div className="designs-loading-inline">
                  <div className="spinner-small"></div>
                </div>
              ) : userDesigns.length > 0 ? (
                <div className="designs-preview">
                  {userDesigns.map((design) => (
                    <div
                      key={design.id}
                      className="design-thumbnail"
                      onClick={() => {
                        try {
                          const designConfig = JSON.parse(design.colorConfig);
                          setConfig(designConfig);
                          setIsModalOpen(true);
                        } catch (error) {
                          console.error("Error parsing design config:", error);
                        }
                      }}
                    >
                      <img
                        src={`http://localhost:8080${design.imagePath}`}
                        alt="Custom design"
                      />
                      <span className="design-date-small">
                        {new Date(design.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-designs-text">No custom designs yet</p>
              )}
            </div>

            <button onClick={handleOpenModal} className="customize-button">
              Customize This Model
            </button>
          </div>
        </div>
      </div>

      {/* 3D Model Customization Modal */}
      {customizeModel && (
        <ModalInteracting3DModel
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleOnSave}
          modelUrl={`http://localhost:8080${customizeModel.modelPath}`}
          setConfig={setConfig}
          config={config}
        />
      )}
    </div>
  );
};

export default CustomizeDetails;
