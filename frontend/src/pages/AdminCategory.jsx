import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSearch } from "react-icons/fi";
import "../assets/styles/pages/AdminCategory.scss";
import AdminCategoryModal from "../components/modal/AdminCategoryModal";
import { toast } from "react-toastify";
import {
  createCategory,
  deleteCategory,
  getCategoriesPaginate,
  updateCategory,
} from "../api/categoryApi";
import useAuth from "../hooks/UseAuth";
import { formatToVNDate } from "../utils/ultils";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setshowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    categoryDescription: "",
    status: "active",
    image: null,
    imagePreview: "",
  });

  const { token } = useAuth();
  const pageSize = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const data = await getCategoriesPaginate(currentPage, pageSize);

      if (data) {
        setTotalPages(data.totalPages);
        setCategories(data.content);
      }
      setLoading(false);
    };

    fetchCategories();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddCategoryModal = () => {
    setEditingCategory(null);
    setshowModal(true);
  };

  const handleEditCategoryModal = (category) => {
    setEditingCategory(category);
    setshowModal(true);
  };

  const handleClose = () => {
    setshowModal(false);
    setEditingCategory(null);
  };

  const handleCreateCategory = async () => {
    const formCreateCategory = {
      name: formData.name,
      categoryDescription: formData.categoryDescription,
    };

    const imageCreateRequest = formData.image;

    if (imageCreateRequest) {
      const formdata = new FormData();
      formdata.append(
        "category",
        new Blob([JSON.stringify(formCreateCategory)], {
          type: "application/json",
        })
      );
      formdata.append("image", imageCreateRequest);

      const createdCategory = await createCategory(formdata, token);

      if (createdCategory) {
        setCategories((prev) => [...prev, createdCategory]);
        toast.success("Tạo category thành công!");
      }
    } else {
      toast.error("Thiếu hình ảnh!");
      return;
    }
  };

  const handleEditCategory = async () => {
    const formUpdateCategory = {
      id: editingCategory.id,
      name: formData.name,
      categoryDescription: formData.categoryDescription,
      active: formData.status,
    };

    const imageUpdateRequest = formData.image;

    if (imageUpdateRequest) {
      const formdata = new FormData();
      formdata.append(
        "category",
        new Blob([JSON.stringify(formUpdateCategory)], {
          type: "application/json",
        })
      );
      formdata.append("image", imageUpdateRequest);

      const updatedCategory = await updateCategory(formdata, token);

      if (updatedCategory) {
        setCategories((prev) =>
          prev.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          )
        );
        toast.success("Cập nhập category thành công!");
      }
    } else {
      toast.error("Thiếu hình ảnh!");
      return;
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc muốn xóa category này?")) {
      await deleteCategory(token, categoryId);
      const updatedCategories = categories.filter(
        (category) => category.id !== categoryId
      );
      setCategories(updatedCategories);

      toast.success("Xóa category thành công!");
    }
  };

  // Count statistics
  const activeCategories = categories.filter((cat) => cat.active).length;
  const totalProducts = categories.reduce(
    (sum, cat) => sum + cat.totalProduct,
    0
  );

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <div className="admin-category">
      <div className="page-header">
        <h1>Product Categories</h1>
        <button className="add-btn" onClick={handleAddCategoryModal}>
          <FiPlus />
          <span>Add Category</span>
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{activeCategories}</h3>
            <p>Active Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products">
            <div className="icon-wrapper">
              <FiPackage />
            </div>
          </div>
          <div className="stat-content">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>
      </div>

      <div className="category-container">
        <div className="filter-bar">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="categories-list">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Products</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="category-name truncate">
                    <div className="name-with-icon">
                      <span className="truncate">{category.name}</span>
                    </div>
                  </td>
                  <td className="category-description truncate">
                    {category.categoryDescription}
                  </td>
                  <td>
                    <div className="category-image">
                      <img
                        src={`http://localhost:8080${category.imagePath}`}
                        alt={category.name}
                        width="60"
                        height="60"
                      />
                    </div>
                  </td>
                  <td className="category-products truncate">
                    {category.totalProduct}
                  </td>
                  <td className="category-status truncate">
                    <span className={`status-badge ${category.active}`}>
                      {category.active === true ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="category-date truncate">
                    {formatToVNDate(category.createdAt)}
                  </td>
                  <td className="category-actions">
                    <button
                      className="edit-btn"
                      title="Edit Category"
                      onClick={() => handleEditCategoryModal(category)}
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="delete-btn"
                      title="Delete Category"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button
            className="prev-btn"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`page-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="next-btn"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <AdminCategoryModal
          editingCategory={editingCategory}
          onClose={handleClose}
          handleEditCategory={handleEditCategory}
          handleCreateCategory={handleCreateCategory}
          categories={categories}
          setFormData={setFormData}
          formData={formData}
        />
      )}
    </div>
  );
};

export default AdminCategory;
