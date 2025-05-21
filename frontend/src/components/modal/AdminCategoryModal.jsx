import React, { useState, useEffect } from 'react';
import "../../assets/styles/components/modal/Modal.scss"
import ImageDropUploader from '../ImageDropUploader';

const AdminCategoryModal = ({ editingCategory, onClose,formData,setFormData, handleEditCategory,handleCreateCategory}) => {
  

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || '',
        categoryDescription: editingCategory.categoryDescription || '',
        status: editingCategory.status || true,
        image: editingCategory.imagePath
      });
    }
  }, [editingCategory, setFormData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    console.log(formData)
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if(editingCategory && editingCategory.id) {
      handleEditCategory();
    }else{
      handleCreateCategory();
    }

    onClose();
    setFormData({
      name:  '',
      categoryDescription: '',
      status:  true,
      image: null
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="categoryDescription">Description</label>
            <textarea
              id="categoryDescription"
              name="categoryDescription"
              value={formData.categoryDescription}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <ImageDropUploader onUpload={handleImageChange} imagePreview={editingCategory?.imagePath}/>
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryModal;