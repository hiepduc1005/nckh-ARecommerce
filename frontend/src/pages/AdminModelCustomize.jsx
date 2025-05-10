import React, { useState, useEffect } from "react";
import CreateModelCustomizeForm from "../components/CreateModelCustomizeForm";
import ModelCustomizeList from "../components/ModelCustomizeList";
import "../assets/styles/pages/AdminModelCustomize.scss";
import {
  createModelCustomize,
  deleteModelCustomize,
  getModelsByType,
} from "../api/modelCustomize";
import useAuth from "../hooks/UseAuth";
import { toast } from "react-toastify";
const AdminModelCustomize = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { token } = useAuth();

  useEffect(() => {
    fetchModels(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchModels = async (page, size) => {
    setIsLoading(true);
    const data = await getModelsByType(page, size, "");

    setModels(data.content);
    if (data.totalPages !== undefined) {
      setTotalPages(data.totalPages);
      setTotalItems(data.totalElements);
    }
    setIsLoading(false);
  };

  const handleCreateModel = async (newModel) => {
    const data = await createModelCustomize(newModel, token);

    if (data) {
      toast.success("Tạo model thành công!");
      fetchModels(currentPage, pageSize);
    }
  };

  const handleDeleteModel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa model này?")) {
      setIsLoading(true);
      const data = await deleteModelCustomize(token, id);

      if (data) {
        toast.success("Xoa model thanh cong!");
        fetchModels(currentPage, pageSize);
      }
      setIsLoading(false);
    }
  };

  const handleEditModel = (model) => {
    setSelectedModel(model);
  };

  const handleUpdateModel = async (updatedModel) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/models/${updatedModel.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedModel),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật model");
      }

      // Refresh current page
      fetchModels(currentPage, pageSize);
      setSelectedModel(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Quản lý Model Customize</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        <div className="form-container">
          <CreateModelCustomizeForm
            onCreateModel={handleCreateModel}
            selectedModel={selectedModel}
            onUpdateModel={handleUpdateModel}
          />
        </div>

        <div className="list-container">
          {isLoading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <ModelCustomizeList
              models={models}
              onDeleteModel={handleDeleteModel}
              onEditModel={handleEditModel}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModelCustomize;
