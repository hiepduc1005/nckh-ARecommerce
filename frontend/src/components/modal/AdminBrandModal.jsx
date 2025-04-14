import React, { useState, useEffect } from "react";
import "../../assets/styles/components/modal/Modal.scss";
import ImageDropUploader from "../ImageDropUploader";

const AdminBrandModal = ({
  editingBrand,
  onClose,
  formData,
  setFormData,
  handleEditBrand,
  handleCreateBrand,
}) => {
  useEffect(() => {
    if (editingBrand) {
      setFormData({
        brandName: editingBrand.name || "",
        brandDescription: editingBrand.description || "",
        image: editingBrand.imagePath,
        category: editingBrand.category || "",
      });
    }
  }, [editingBrand, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    console.log(formData);
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingBrand && editingBrand.id) {
      handleEditBrand();
    } else {
      handleCreateBrand();
    }

    onClose();
    setFormData({
      brandName: "",
      brandDescription: "",
      image: null,
      category: "",
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingBrand ? "Edit Brand" : "Add New Brand"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brandName">Brand Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="brandDescription">Description</label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={formData.brandDescription}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <textarea
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image</label>
            <ImageDropUploader
              onUpload={handleImageChange}
              imagePreview={editingBrand?.imagePath}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingBrand ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminBrandModal;
