import React from "react";
import "../assets/styles/components/ModelCustomizeList.scss";

const ModelCustomizeList = ({
  models,
  onDeleteModel,
  onEditModel,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    const date = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const translateItemType = (type) => {
    switch (type) {
      case "SHOE":
        return "Giày";
      case "GLASSES":
        return "Kính";
      default:
        return type;
    }
  };

  // Pagination logic
  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Maximum number of page buttons to show

    if (totalPages <= maxPagesToShow) {
      // If we have less pages than max, show all pages
      return range(1, totalPages);
    }

    // Always include first and last page
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    // Adjust if we're near the end
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pages = range(startPage, endPage);

    // Add first page with dots if needed
    if (startPage > 1) {
      if (startPage > 2) {
        pages.unshift("...");
      }
      pages.unshift(1);
    }

    // Add last page with dots if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="model-list">
      <div className="model-list-header">
        <h2>Danh sách Models</h2>
        <div className="page-size-selector">
          <label htmlFor="pageSize">Hiển thị:</label>
          <select id="pageSize" value={pageSize} onChange={onPageSizeChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="no-models">Chưa có model nào được tạo</div>
      ) : (
        <>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Loại</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id}>
                    <td className="image-cell">
                      {model.imagePath ? (
                        <img
                          src={`http://localhost:8080${model.imagePath}`}
                          alt={model.name}
                          className="model-image"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>{model.name}</td>
                    <td>{model.price?.toLocaleString("vi-VN")} đ</td>
                    <td>{translateItemType(model.itemType)}</td>
                    <td>{formatDateTime(model.createdAt)}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => onEditModel(model)}
                        title="Chỉnh sửa"
                      >
                        <i className="fas fa-edit"></i> Sửa
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => onDeleteModel(model.id)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash-alt"></i> Xóa
                      </button>
                      <button className="btn-view" title="Xem chi tiết">
                        <i className="fas fa-eye"></i> Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn prev"
                  onClick={handlePrevClick}
                  disabled={currentPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={index}
                      className={`pagination-btn page-number ${
                        currentPage === page - 1 ? "active" : ""
                      }`}
                      onClick={() => handlePageClick(page - 1)}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="pagination-ellipsis">
                      {page}
                    </span>
                  )
                )}

                <button
                  className="pagination-btn next"
                  onClick={handleNextClick}
                  disabled={currentPage === totalPages - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}

            <div className="total-items">Tổng số: {totalItems} model</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModelCustomizeList;
