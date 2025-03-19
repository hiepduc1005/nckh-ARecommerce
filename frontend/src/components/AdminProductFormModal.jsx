import React, { useEffect, useState } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import '../assets/styles/components/AdminProductFormModal.scss';
import { getAllCategories } from '../api/categoryApi';
import { getAllBrands } from '../api/brandApi';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';


const ProductFormModal = ({ isOpen, onClose, product = null }) => {
  const [formData, setFormData] = useState(
    product || {
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      description: '',
      status: 'Active',
      images: []
    }
  );

  const [categoryOptions,setCategoryOptions] = useState([]);
  const [brandOptions,setBrandOptions] = useState([])

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if(data){
          const options = data.map(category => ({
            value: category.id,
            label: category.categoryName,
          }));
          setCategoryOptions(options)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        return [];
      }
    };
    
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        if(data){
          const options = data.map(brand => ({
            value: brand.id,
            label: brand.name,
          }));
          setBrandOptions(options)
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        return [];
      }
    };

    fetchCategories()
    fetchBrands()

  },[])
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission - API call would go here
    console.log('Submitted data:', formData);
    onClose();
  };

  const animatedComponents = makeAnimated();

  
  if (!isOpen) return null;

  
  return (
    <div className="modal-overlay">
      <div className="product-form-modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
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
              <label htmlFor="category">Category</label>
               <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={categoryOptions}
                  placeholder="Chọn danh mục..."
                />
            </div>
            
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
                <Select
                  components={animatedComponents}
                  options={brandOptions}
                  placeholder="Chọn thương hiệu..."
                />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
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
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          
          <div className="form-group full-width">
            <label>Product Images</label>
            <div className="image-upload-area">
              <div className="upload-placeholder">
                <div style={{display: "flex",justifyContent:"center"}}><FiUpload /></div>
                
                <span>Drop images here or click to upload</span>
                <small>Maximum 5 images, JPG or PNG (Max 2MB each)</small>
                <input type="file" multiple accept="image/*" />
              </div>
              
              <div className="image-preview-container">
                {/* Image previews would go here */}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;