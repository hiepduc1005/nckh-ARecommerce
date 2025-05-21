import React, { useEffect, useState } from "react";
import { FiX, FiUpload, FiTrash2, FiEye } from "react-icons/fi";
import "../../assets/styles/components/AdminProductFormModal.scss";
import { getAllCategories } from "../../api/categoryApi";
import { getAllBrands } from "../../api/brandApi";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { getAllAttributes } from "../../api/attributeApi";
import { getAllTags } from "../../api/tagApi";
import Modal3DView from "../ar/Modal3DView";
import { toast } from "react-toastify";

const ProductFormModal = ({
  isOpen,
  onClose,
  product = null,
  handleAddProduct,
  handleUpdateProduct,
}) => {
  const [formData, setFormData] = useState(() => {
    if (product) {
      return {
        productName: product.productName || "",
        description: product?.description || "",
        shortDescription: product?.shortDescription || "",
        active: product?.active || false,
        image: null,
        model: null,
      };
    } else {
      return {
        productName: "",
        description: "",
        shortDescription: "",
        active: false,
        image: null,
        model: null,
      };
    }
  });

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [attributeOptions, setAttributeOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);
  const [modelPreview, setModelPreview] = useState("");
  const [showModelPreview, setShowModalPreview] = useState(false);

  // New states for improved UX
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [modelFileInfo, setModelFileInfo] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        if (data) {
          const options = data.map((category) => ({
            value: category.id,
            label: category.name,
          }));
          setCategoryOptions(options);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        return [];
      }
    };

    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        if (data) {
          const options = data.map((brand) => ({
            value: brand.id,
            label: brand.name,
          }));
          setBrandOptions(options);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        return [];
      }
    };

    const fetchAttribute = async () => {
      try {
        const data = await getAllAttributes();
        if (data) {
          const options = data.map((attribute) => ({
            value: attribute.id,
            label: attribute.attributeName,
          }));
          setAttributeOptions(options);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thuoc tinh:", error);
        return [];
      }
    };

    const fetchTags = async () => {
      try {
        const data = await getAllTags();
        if (data) {
          const options = data.map((tag) => ({
            value: tag.id,
            label: tag.tagName,
          }));
          setTagOptions(options);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thuoc tinh:", error);
        return [];
      }
    };

    if (product) {
      const productCategoriesSelected = product?.categories?.map(
        (category) => ({
          value: category.id,
          label: category.name,
        })
      );
      const productAttributesSelected = product?.attributeResponses?.map(
        (attribute) => ({
          value: attribute.id,
          label: attribute.attributeName,
        })
      );
      const productTagsSelected = product?.tags?.map((tag) => ({
        value: tag.id,
        label: tag.tagName,
      }));

      const productSelectedBrand = {
        value: product?.brandResponse?.id,
        label: product?.brandResponse?.name,
      };

      setSelectedCategories(productCategoriesSelected);
      setSelectedAttributes(productAttributesSelected);
      setSelectedTags(productTagsSelected);
      setSelectedBrand(productSelectedBrand);

      // Nếu đang edit sản phẩm và có URL ảnh, hiển thị ảnh preview
      if (product?.imagePath) {
        setImagePreview(`http://localhost:8080${product.imagePath}`);
      }

      // Nếu có model path, hiển thị thông tin model
      if (product?.modelPath) {
        setModelPreview(`http://localhost:8080${product.modelPath}`);
        const modelPathParts = product.modelPath.split("/");
        const fileName = modelPathParts[modelPathParts.length - 1];
        setModelFileInfo({
          name: fileName,
          size: "N/A (Existing model)",
        });
      }
    }

    fetchTags();
    fetchCategories();
    fetchBrands();
    fetchAttribute();
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions);
  };

  const handleAttributeChange = (selectedOptions) => {
    setSelectedAttributes(selectedOptions);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
  };

  // Xử lý upload ảnh với preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 2MB");
        return;
      }

      // Cập nhật file trong formData
      setFormData({
        ...formData,
        image: file,
      });

      // Tạo URL preview cho ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleModelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["model/gltf-binary", "model/gltf+json"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!["glb", "gltf"].includes(fileExtension)) {
        toast.error("Chỉ chấp nhận file định dạng GLB hoặc GLTF");
        return;
      }

      // Kiểm tra kích thước file (max 10MB)
      if (file.size > 20 * 1024 * 1024) {
        toast.error("Kích thước model không được vượt quá 20MB");
        return;
      }

      // Set loading state
      setIsModelLoading(true);

      // Cập nhật file trong formData
      setFormData({
        ...formData,
        model: file,
      });

      // Lưu thông tin file
      setModelFileInfo({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
      });

      // Tạo URL preview cho model
      const previewUrl = URL.createObjectURL(file);
      setModelPreview(previewUrl);

      // End loading state after a short delay to simulate processing
      setTimeout(() => {
        setIsModelLoading(false);
      }, 800);
    }
  };

  // Xóa ảnh
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null,
    });
    setImagePreview(null);

    // Đảm bảo reset input file
    const fileInput = document.getElementById("product-image");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Xóa model
  const handleRemoveModel = () => {
    setFormData({
      ...formData,
      model: null,
    });
    setModelPreview("");
    setModelFileInfo(null);

    // Đảm bảo reset input file
    const fileInput = document.getElementById("product-model");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleClose = () => {
    if (imagePreview && !product?.imagePath) {
      URL.revokeObjectURL(imagePreview);
    }

    if (modelPreview && !product?.modelPath) {
      URL.revokeObjectURL(modelPreview);
    }

    onClose();
    setFormData({
      productName: "",
      description: "",
      shortDescription: "",
      active: false,
      image: null,
      model: null,
    });

    // Reset states
    setModelError("");
    setModelFileInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.productName.trim()) {
      toast.error("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!selectedBrand || !selectedBrand.value) {
      toast.error("Vui lòng chọn thương hiệu");
      return;
    }

    if (!selectedCategories || selectedCategories.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    const categoryIds = selectedCategories.map((selected) => selected.value);
    const tagIds = selectedTags
      ? selectedTags.map((selected) => selected.value)
      : [];
    const attributeIds = selectedAttributes
      ? selectedAttributes.map((selected) => selected.value)
      : [];
    const brandId = selectedBrand.value;

    if (product) {
      const dataUpdate = {
        id: product.id,
        productName: formData.productName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryIds,
        tagIds,
        attributeIds,
        brandId,
        active: formData.active === "true" || formData.active === true,
      };

      const image = formData.image;
      const model = formData.model;

      const formDataUpdate = new FormData();
      formDataUpdate.append(
        "product",
        new Blob([JSON.stringify(dataUpdate)], { type: "application/json" })
      );

      if (image) {
        formDataUpdate.append("image", image);
      }

      if (model) {
        formDataUpdate.append("model", model);
      }

      try {
        await handleUpdateProduct(formDataUpdate);
        toast.success("Cập nhật sản phẩm thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi cập nhật sản phẩm: " + error.message);
      }
    } else {
      const dataCreate = {
        productName: formData.productName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categoryIds,
        tagIds,
        attributeIds,
        brandId,
        active: formData.active === "true" || formData.active === true,
      };

      const image = formData.image;
      const model = formData.model;

      const formDataCreate = new FormData();
      formDataCreate.append(
        "product",
        new Blob([JSON.stringify(dataCreate)], { type: "application/json" })
      );

      if (image) {
        formDataCreate.append("image", image);
      }

      if (model) {
        formDataCreate.append("model", model);
      }

      try {
        await handleAddProduct(formDataCreate);
        toast.success("Thêm sản phẩm thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm: " + error.message);
      }
    }

    handleClose();
  };

  const animatedComponents = makeAnimated();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="product-form-modal">
        <div className="modal-header">
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <button className="close-btn" onClick={handleClose}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                Product Name <span className="required">*</span>
              </label>
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
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
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
              <label htmlFor="brand">
                Brand <span className="required">*</span>
              </label>
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
            <label htmlFor="shortDescription">Short Description</label>
            <textarea
              id="shortDescription"
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <FiUpload />
                  </div>
                  <span>Drop image here or click to upload</span>
                  <small>JPG or PNG (Max 2MB)</small>
                  <input
                    id="product-image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/jpg"
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

          <div className="form-group full-width">
            <label>Product 3D Model</label>
            <div className="image-upload-area">
              {!modelPreview ? (
                <div className="upload-placeholder">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <FiUpload />
                  </div>
                  <span>Drop 3D model here or click to upload</span>
                  <small>GLB or GLTF format (Max 10MB)</small>
                  <input
                    id="product-model"
                    type="file"
                    onChange={handleModelChange}
                    accept=".glb,.gltf"
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
                          <strong>Định dạng:</strong>{" "}
                          {modelFileInfo?.type || "GLB/GLTF"}
                        </div>
                        <div className="model-actions">
                          <button
                            type="button"
                            className="view-model-btn"
                            onClick={() => setShowModalPreview(true)}
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

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {showModelPreview && (
        <Modal3DView
          isOpen={showModelPreview}
          onClose={() => setShowModalPreview(false)}
          modelUrl={modelPreview}
        />
      )}
    </div>
  );
};

export default ProductFormModal;
