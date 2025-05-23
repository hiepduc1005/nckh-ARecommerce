import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiTrash2, FiUpload, FiCamera } from "react-icons/fi";
import "../assets/styles/components/CreateModelCustomizeForm.scss";
import { toast } from "react-toastify";
import Modal3DView from "./ar/Modal3DView";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { captureModelImage } from "../utils/ultils";

const CreateModelCustomizeForm = ({
  onCreateModel,
  selectedModel,
  onUpdateModel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    itemType: "SHOE",
    imageFile: null,
    modelFile: null,
    imagePath: "",
    modelPath: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [modelPreview, setModelPreview] = useState("");
  const [showModelPreview, setShowModelPreview] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelFileInfo, setModelFileInfo] = useState(null);

  // Biến để theo dõi trạng thái chụp ảnh tự động
  const [autoCaptured, setAutoCaptured] = useState(false);

  useEffect(() => {
    if (selectedModel) {
      setFormData({
        id: selectedModel.id,
        name: selectedModel.name,
        price: selectedModel.price,
        itemType: selectedModel.itemType,
        imageFile: null,
        modelFile: null,
        imagePath: selectedModel.imagePath,
        modelPath: selectedModel.modelPath,
      });
      setPreviewImage(`http://localhost:8080${selectedModel.imagePath}`);

      if (selectedModel.modelPath) {
        setModelPreview(`http://localhost:8080${selectedModel.modelPath}`);
        const modelPathParts = selectedModel.modelPath.split("/");
        const fileName = modelPathParts[modelPathParts.length - 1];
        setModelFileInfo({
          name: fileName,
          size: "N/A (Existing model)",
          type: fileName.split(".").pop().toUpperCase(),
        });
      }

      setIsEditing(true);
    } else {
      resetForm();
    }
  }, [selectedModel]);

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      itemType: "SHOE",
      imageFile: null,
      modelFile: null,
      imagePath: "",
      modelPath: "",
    });
    setPreviewImage("");
    setModelPreview("");
    setModelFileInfo(null);
    setIsEditing(false);
    setAutoCaptured(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý khi người dùng muốn tự chụp ảnh
  const handleCaptureModelImage = async () => {
    if (!formData.modelFile && !modelPreview) {
      toast.error("Vui lòng tải lên model 3D trước khi chụp ảnh");
      return;
    }

    if (!formData.modelFile) {
      toast.error("Không thể chụp ảnh từ model đã lưu trước đó");
      return;
    }

    try {
      setIsModelLoading(true);
      const imageFile = await captureModelImage(formData.modelFile);

      // Cập nhật formData với file ảnh mới
      setFormData((prevData) => ({
        ...prevData,
        imageFile: imageFile,
      }));

      // Cập nhật preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(imageFile);

      setAutoCaptured(true);
      toast.success("Đã chụp ảnh model thành công!");
    } catch (error) {
      toast.error("Lỗi khi chụp ảnh model: " + error.message);
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];

      if (name === "imageFile") {
        // Kiểm tra kích thước file ảnh (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          toast.error("Kích thước ảnh không được vượt quá 2MB");
          return;
        }

        setFormData({
          ...formData,
          [name]: file,
        });

        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      if (name === "modelFile") {
        // Validate file type
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (!["obj", "glb", "gltf", "fbx"].includes(fileExtension)) {
          toast.error("Chỉ chấp nhận file định dạng OBJ, GLB, GLTF hoặc FBX");
          return;
        }

        // Kiểm tra kích thước file (max 20MB)
        if (file.size > 150 * 1024 * 1024) {
          toast.error("Kích thước model không được vượt quá 150MB");
          return;
        }

        // Set loading state
        setIsModelLoading(true);

        setFormData({
          ...formData,
          [name]: file,
        });

        // Lưu thông tin file
        setModelFileInfo({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          type: file.type || fileExtension.toUpperCase(),
        });

        // Tạo URL preview cho model
        const previewUrl = URL.createObjectURL(file);
        setModelPreview(previewUrl);

        // End loading state after a short delay - Tiếp tục xử lý
        setTimeout(() => {
          setIsModelLoading(false);

          // Tự động chụp ảnh model sau khi load xong
          captureModelImage(file)
            .then((imageFile) => {
              // Cập nhật formData với file ảnh mới
              setFormData((prevData) => ({
                ...prevData,
                imageFile: imageFile,
              }));

              // Cập nhật preview image
              const reader = new FileReader();
              reader.onload = (e) => {
                setPreviewImage(e.target.result);
              };
              reader.readAsDataURL(imageFile);

              setAutoCaptured(true);
              toast.success("Đã tự động chụp ảnh model!");
            })
            .catch((error) => {
              console.error("Lỗi khi tự động chụp ảnh:", error);
              toast.error("Không thể tự động chụp ảnh model: " + error.message);
            });
        }, 800);
      }
    }
  };

  // Xóa model
  const handleRemoveModel = () => {
    setFormData({
      ...formData,
      modelFile: null,
    });

    if (!isEditing) {
      setModelPreview("");
      setModelFileInfo(null);
      // Nếu ảnh là được chụp tự động, cũng xóa luôn ảnh
      if (autoCaptured) {
        setPreviewImage("");
        setFormData((prev) => ({
          ...prev,
          imageFile: null,
        }));
        setAutoCaptured(false);
      }
    } else {
      // Nếu đang edit, reset về model path ban đầu
      if (selectedModel && selectedModel.modelPath) {
        setModelPreview(selectedModel.modelPath);
        const modelPathParts = selectedModel.modelPath.split("/");
        const fileName = modelPathParts[modelPathParts.length - 1];
        setModelFileInfo({
          name: fileName,
          size: "N/A (Existing model)",
          type: fileName.split(".").pop().toUpperCase(),
        });
      } else {
        setModelPreview("");
        setModelFileInfo(null);
      }
    }

    // Reset input file
    const fileInput = document.getElementById("modelFile");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.modelFile && !formData.modelPath) {
      toast.error("Vui lòng chọn file model 3D");
      return;
    }

    const modelCustomizeCreate = {
      name: formData.name,
      price: formData.price,
      itemType: formData.itemType,
    };

    const formDataToSend = new FormData();
    formDataToSend.append(
      "customize",
      new Blob([JSON.stringify(modelCustomizeCreate)], {
        type: "application/json",
      })
    );

    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    if (formData.modelFile) {
      formDataToSend.append("model", formData.modelFile);
    }

    if (isEditing) {
      formDataToSend.append("id", formData.id);
      formDataToSend.append("imagePath", formData.imagePath);
      formDataToSend.append("modelPath", formData.modelPath);
      await onUpdateModel(formDataToSend);
    } else {
      await onCreateModel(formDataToSend);
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="create-model-form">
      <h2>{isEditing ? "Cập nhật Model" : "Tạo Model Mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Tên Model:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Giá:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="itemType">Loại sản phẩm:</label>
          <select
            id="itemType"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
          >
            <option value="SHOE">Giày</option>
            <option value="GLASSES">Kính</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="modelFile">File Model 3D:</label>
          <div className="image-upload-area">
            {!modelPreview ? (
              <div className="upload-placeholder">
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <FiUpload />
                </div>
                <span>Kéo thả file 3D vào đây hoặc nhấn để tải lên</span>
                <small>OBJ, GLB, GLTF hoặc FBX (Tối đa 20MB)</small>
                <input
                  type="file"
                  id="modelFile"
                  name="modelFile"
                  onChange={handleFileChange}
                  accept=".obj,.glb,.gltf,.fbx"
                  required={!isEditing || !formData.modelPath}
                />
              </div>
            ) : (
              <div className="model-preview-container">
                {isModelLoading ? (
                  <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p>Đang tải model...</p>
                  </div>
                ) : (
                  <>
                    <div className="model-info">
                      <div className="model-file-details">
                        <strong>Tên file:</strong> {modelFileInfo?.name}
                        <br />
                        <strong>Kích thước:</strong> {modelFileInfo?.size}
                        <br />
                        <strong>Định dạng:</strong> {modelFileInfo?.type}
                      </div>
                      <div className="model-actions">
                        <button
                          type="button"
                          className="view-model-btn"
                          onClick={() => setShowModelPreview(true)}
                        >
                          <FiEye /> Xem model 3D
                        </button>
                        <button
                          type="button"
                          className="remove-model-btn"
                          onClick={handleRemoveModel}
                        >
                          <FiTrash2 /> Xóa model
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Hình ảnh:</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
              required={!isEditing && !previewImage && !autoCaptured}
            />
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
                {formData.imageFile && (
                  <div className="image-info">
                    <small>
                      {autoCaptured
                        ? "Ảnh được tạo tự động từ model 3D"
                        : "Ảnh đã tải lên"}
                    </small>
                  </div>
                )}
              </div>
            )}
            {modelPreview && formData.modelFile && (
              <button
                type="button"
                className="btn-capture-model"
                onClick={handleCaptureModelImage}
                disabled={isModelLoading}
              >
                <FiCamera />{" "}
                {previewImage && autoCaptured
                  ? "Chụp lại ảnh từ model"
                  : "Chụp ảnh từ model"}
              </button>
            )}
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {isEditing ? "Cập nhật" : "Tạo mới"}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {showModelPreview && (
        <Modal3DView
          isOpen={showModelPreview}
          onClose={() => setShowModelPreview(false)}
          modelUrl={modelPreview}
        />
      )}
    </div>
  );
};

export default CreateModelCustomizeForm;
