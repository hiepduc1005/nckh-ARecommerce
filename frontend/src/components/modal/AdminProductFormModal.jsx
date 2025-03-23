import React, { useEffect, useState } from 'react';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import '../../assets/styles/components/AdminProductFormModal.scss';
import { getAllCategories } from '../../api/categoryApi';
import { getAllBrands } from '../../api/brandApi';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import { getAllAttributes } from '../../api/attributeApi';
import { getAllTags } from '../../api/tagApi';


const ProductFormModal = ({ isOpen, onClose, product = null,handleAddProduct,handleUpdateProduct}) => {
  const [formData, setFormData] = useState(() => {
      if(product){
        return {
          productName: product.productName || "",
          description: product?.description || '',
          shortDescription: product?.shortDescription || "",
          active: product?.active || false,
          image: null
        }
      }else {
        return {
          productName: '',
          description: '',
          shortDescription: "",
          active: false,
          image: null
        }
      }
    }
  );

  const [categoryOptions,setCategoryOptions] = useState([]);
  const [brandOptions,setBrandOptions] = useState([])
  const [attributeOptions,setAttributeOptions] = useState([])
  const [tagOptions,setTagOptions] = useState([])

  const [selectedBrand,setSelectedBrand] = useState([])
  const [selectedCategories,setSelectedCategories] = useState([])
  const [selectedAttributes,setSelectedAttributes] = useState([])
  const [selectedTags,setSelectedTags] = useState();
  const [imagePreview, setImagePreview] = useState(null);


  
  
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

    const fetchAttribute = async () => {
      try {
        const data = await getAllAttributes();
        if(data){
          const options = data.map(attribute => ({
            value: attribute.id,
            label: attribute.attributeName,
          }));
           setAttributeOptions(options)
        }
      } catch (error) {
        console.error("Lỗi khi lấy thuoc tinh:", error);
        return [];
      }
    };

    const fetchTags = async () => {
      try {
        const data = await getAllTags();
        if(data){
          const options = data.map(tag => ({
            value: tag.id,
            label: tag.tagName,
          }));
          setTagOptions(options)
        }
      } catch (error) {
        console.error("Lỗi khi lấy thuoc tinh:", error);
        return [];
      }
    };

    
    if(product){
      const productCategoriesSelected =  product?.categories?.map(category => ({ 
        value: category.id,
        label: category.categoryName,
      }));
      const productAttributesSelected =  product?.attributeResponses?.map(attribute => ({ 
        value: attribute.id,
        label: attribute.attributeName,
      }));
      const productTagsSelected =  product?.tags?.map(tag => ({ 
        value: tag.id,
        label: tag.tagName,
      }));

      const productSelectedBrand = {
        value: product?.brandResponse?.id,
        label: product?.brandResponse?.name,
      }

      setSelectedCategories(productCategoriesSelected)
      setSelectedAttributes(productAttributesSelected)
      setSelectedTags(productTagsSelected)
      setSelectedBrand(productSelectedBrand)

      // Nếu đang edit sản phẩm và có URL ảnh, hiển thị ảnh preview
      if(product?.imagePath){
        setImagePreview(`http://localhost:8080${product.imagePath}`);
      }
    }

    fetchTags()
    fetchCategories()
    fetchBrands()
    fetchAttribute()

  },[product])
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (selectedOptions) => {
    // const categoryIds = selectedOptions.map(option => option.value);
    // setFormData({
    //   ...formData,
    //   categoryIds
    // });

    setSelectedCategories(selectedOptions)
  };
  
  // Tương tự cho attributes, tags, và brand
  const handleAttributeChange = (selectedOptions) => {
    // const attributeIds = selectedOptions.map(option => option.value);
    // setFormData({
    //   ...formData,
    //   attributeIds
    // });

    setSelectedAttributes(selectedOptions)
  };
  
  const handleTagChange = (selectedOptions) => {
    // const tagIds = selectedOptions.map(option => option.value);
    // setFormData({
    //   ...formData,
    //   tagIds
    // });

    setSelectedTags(selectedOptions)
  };
  
  const handleBrandChange = (selectedOption) => {
    // setFormData({
    //   ...formData,
    //   brandId: selectedOption ? selectedOption.value : ''
    // });

    setSelectedBrand(selectedOption)
  };

  // Xử lý upload ảnh với preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cập nhật file trong formData
      setFormData({
        ...formData,
        image: file
      });
      
      // Tạo URL preview cho ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
    
    // Đảm bảo reset input file
    const fileInput = document.getElementById('product-image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleClose = () => {
    if (imagePreview && !product?.imageUrl) {
      URL.revokeObjectURL(imagePreview);
    }

    onClose();
    setFormData({
      productName: '',
      description: '',
      shortDescription: "",
      active: false,
      image: null
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryIds = selectedCategories.map(selected => selected.value)
    const tagIds = selectedTags.map(selected => selected.value)
    const attributeIds = selectedAttributes.map(selected => selected.value)
    const brandId = selectedBrand.value;

    
    if(product){
      const dataUpdate = {
        id: product.id,
        productName: formData.productName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryIds,
        tagIds,
        attributeIds,
        brandId,
        active: formData.active
      }

      const image = formData.image;

      const formDataUpdate = new FormData()
      formDataUpdate.append('product', new Blob([JSON.stringify(dataUpdate)], { type: "application/json" }));
      formDataUpdate.append("image" , image)

      await handleUpdateProduct(formDataUpdate);
    }else{
      const dataCreate = {
        productName: formData.productName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryIds,
        tagIds,
        attributeIds,
        brandId,
        active: formData.active
      }

      const image = formData.image;

      const formDataCreate = new FormData()
      formDataCreate.append("product", new Blob([JSON.stringify(dataCreate)], { type: "application/json" }));
      formDataCreate.append("image" , image)

      await handleAddProduct(formDataCreate);

    }
    handleClose();
  };

  const animatedComponents = makeAnimated();

  
  if (!isOpen) return null;

  
  return (
    <div className="modal-overlay">
      <div className="product-form-modal">
        <div className="modal-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={handleClose}>
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
                name="productName"
                value={formData.productName}
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
                  onChange={handleCategoryChange}
                  options={categoryOptions}
                  placeholder="Chọn danh mục..."
                  value={selectedCategories}
                />
            </div>

            <div className="form-group">
              <label htmlFor="category">Attributes</label>
               <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  onChange={handleAttributeChange}
                  options={attributeOptions}
                  placeholder="Chọn thuộc tính..."
                  value={selectedAttributes}
                />
            </div>

            <div className="form-group">
              <label htmlFor="category">Tags</label>
               <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={tagOptions}
                  onChange={handleTagChange}
                  placeholder="Chọn tags..."
                  value={selectedTags}        
                />
            </div>
            
            <div className="form-group">
              <label htmlFor="brand">Brand</label>
                <Select
                  components={animatedComponents}
                  options={brandOptions}
                  onChange={handleBrandChange}
                  placeholder="Chọn thương hiệu..."
                  value={selectedBrand}
                />
            </div>
            
           
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="active"
                value={formData.active}
                onChange={handleChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label htmlFor="description">Short Description</label>
            <textarea
              id="description"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows="2"
            ></textarea>
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
            <label>Product Image</label>
            <div className="image-upload-area">
              {!imagePreview ? (
                <div className="upload-placeholder">
                  <div style={{display: "flex", justifyContent: "center"}}><FiUpload /></div>
                  <span>Drop image here or click to upload</span>
                  <small>JPG or PNG (Max 2MB)</small>
                  <input 
                    id="product-image"
                    type="file" 
                    onChange={handleImageChange}  
                    accept="image/*" 
                  />
                </div>
              ) : (
                <div className="image-preview-container">
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={handleRemoveImage}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
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