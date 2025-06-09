import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalInteracting3DModel from "../components/ar/ModalInteracting3DModel";
import "../assets/styles/pages/CustomizeDetails.scss";
import {
  createModelDesign,
  getModelCustomizeById,
  deleteModelDesign,
  getModelsDesignBySessionIdAndCustomizeId,
} from "../api/modelCustomize";
import {
  captureModelImage,
  captureModelImageFromURL,
  encryptData,
} from "../utils/ultils";
import ShareDesignModal from "../components/modal/ShareDesignModal";
import { toast } from "react-toastify";
import useAuth from "../hooks/UseAuth";

const CustomizeDetails = () => {
  const { customizeId } = useParams();
  const [customizeModel, setCustomizeModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState({});
  const [userDesigns, setUserDesigns] = useState([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);

  // Add state for share modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { user, token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (customizeModel) {
      document.title = `${customizeModel.name} tùy chỉnh | HHQTV Store`;
    }
  }, [customizeModel]);

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
      fetchUserDesigns();
    }
  }, [customizeId, navigate]);

  const fetchUserDesigns = async () => {
    try {
      setDesignsLoading(true);
      const sessionId = localStorage.getItem("session_id");

      if (!sessionId) {
        console.log("No session ID found");
        return;
      }

      const response = await getModelsDesignBySessionIdAndCustomizeId(
        0,
        10,
        sessionId,
        customizeId
      );
      if (response && response.content) {
        setUserDesigns(response.content);
      }
    } catch (err) {
      console.error("Error fetching user designs:", err);
    } finally {
      setDesignsLoading(false);
    }
  };

  const handleOpenModal = () => {
    // Open the modal with current config
    setIsModalOpen(true);
  };

  const handleOnSave = async (updatedConfig) => {
    if (userDesigns.length >= 10) {
      toast.error(
        "Bạn đã đạt giới hạn tối đa thiết kế. Vui lòng xóa thiết kế cũ trước khi tạo mới."
      );
      return;
    }
    setConfig(updatedConfig);

    const sessionId = localStorage.getItem("session_id");

    const dataCreate = {
      sessionId,
      modelId: customizeId,
      colorConfig: JSON.stringify(updatedConfig),
    };

    const imageDesign = await captureModelImageFromURL(
      `http://localhost:8080${customizeModel?.modelPath}`,
      updatedConfig
    );

    const formDataToSend = new FormData();

    formDataToSend.append(
      "design",
      new Blob([JSON.stringify(dataCreate)], {
        type: "application/json",
      })
    );

    formDataToSend.append("image", imageDesign);

    const data = await createModelDesign(formDataToSend);

    setIsModalOpen(false);
    setConfig(null);
    // After saving the design, refresh the user designs
    fetchUserDesigns();

    // Close the modal
  };

  const handleCloseModal = (updatedConfig) => {
    // Update the config with what came from the modal
    if (updatedConfig) {
      setConfig(updatedConfig);
    }

    // Close the modal
    setIsModalOpen(false);
    setConfig(null);

    // Refresh user designs after closing modal
    fetchUserDesigns();
  };

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  // Add handler for opening share modal
  const handleOpenShareModal = () => {
    if (selectedDesign) {
      setIsShareModalOpen(true);
    }
  };

  // Add handler for closing share modal
  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
  };

  // Add handler for deleting a design
  const handleDeleteDesign = async (e, designId) => {
    e.stopPropagation(); // Prevent triggering design selection
    try {
      await deleteModelDesign(designId);

      if (selectedDesign && selectedDesign.id === designId) {
        setSelectedDesign(null);
      }

      fetchUserDesigns();

      toast.success("Delete design success!");
    } catch (err) {
      console.error("Error deleting design:", err);
      toast.error("Failed to delete design. Please try again.");
    }
  };

  const handleClickOrder = () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    const data = {
      coupon: null,
      discountAmount: 0,
      isCustomized: true,
      items: [
        {
          quantity: 1,
          design: {
            id: selectedDesign.id,
            name: customizeModel.name,
            price: customizeModel.price,
            colorConfig: selectedDesign.colorConfig,
            imagePath: selectedDesign.imagePath,
          },
        },
      ],
    };

    const encryptedData = encryptData(data);
    const encodedData = encodeURIComponent(encryptedData);

    navigate(`/checkout?encrd=${encodedData}`);
  };
  // Add handler for buying design
  const handleBuyDesign = async () => {
    if (!selectedDesign) {
      toast.error("Vui lòng chọn một thiết kế để mua.");
      return;
    }

    try {
      handleClickOrder();
    } catch (err) {
      console.error("Error purchasing design:", err);
      toast.error("Có lỗi xảy ra khi mua sản phẩm. Vui lòng thử lại.");
    }
  };

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
                `http://localhost:8080${
                  selectedDesign
                    ? selectedDesign.imagePath
                    : customizeModel.imagePath
                }` || "/placeholder-image.jpg"
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
                      className={`design-thumbnail ${
                        selectedDesign && selectedDesign.id === design.id
                          ? "selected-design"
                          : ""
                      }`}
                      onClick={() => handleDesignClick(design)}
                    >
                      <img
                        src={`http://localhost:8080${design.imagePath}`}
                        alt="Custom design"
                      />
                      <button
                        className="delete-design"
                        onClick={(e) => handleDeleteDesign(e, design.id)}
                        title="Delete design"
                      >
                        ×
                      </button>
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

            {/* Action buttons - only show when a design is selected */}
            {selectedDesign && (
              <div className="design-actions">
                <button onClick={handleBuyDesign} className="buy-design-btn">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 4V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H19V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V6H4C3.44772 6 3 5.55228 3 5C3 4.44772 3.44772 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7ZM9 8C9.55228 8 10 8.44772 10 9V17C10 17.5523 9.55228 18 9 18C8.44772 18 8 17.5523 8 17V9C8 8.44772 8.44772 8 9 8ZM15 8C15.5523 8 16 8.44772 16 9V17C16 17.5523 15.5523 18 15 18C14.4477 18 14 17.5523 14 17V9C14 8.44772 14.4477 8 15 8Z"
                      fill="currentColor"
                    />
                  </svg>
                  Mua thiết kế này
                </button>

                <button
                  onClick={handleOpenShareModal}
                  className="share-design-btn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12548 15.0077 5.24917 15.0227 5.37069L8.08264 9.19118C7.54305 8.46078 6.7548 8 5.85714 8C4.27853 8 3 9.34315 3 11C3 12.6569 4.27853 14 5.85714 14C6.7548 14 7.54305 13.5392 8.08264 12.8088L15.0227 16.6293C15.0077 16.7508 15 16.8745 15 17C15 18.6569 16.3431 20 18 20C19.6569 20 21 18.6569 21 17C21 15.3431 19.6569 14 18 14C17.1023 14 16.3141 14.4608 15.7745 15.1912L8.83443 11.3707C8.84949 11.2492 8.85714 11.1255 8.85714 11C8.85714 10.8745 8.84949 10.7508 8.83443 10.6293L15.7745 6.80882C16.3141 7.53922 17.1023 8 18 8Z"
                      fill="currentColor"
                    />
                  </svg>
                  Chia sẻ
                </button>
              </div>
            )}

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

      {/* Share Design Modal */}
      {selectedDesign && (
        <ShareDesignModal
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
          design={selectedDesign}
          modelName={customizeModel.name}
        />
      )}
    </div>
  );
};

export default CustomizeDetails;
