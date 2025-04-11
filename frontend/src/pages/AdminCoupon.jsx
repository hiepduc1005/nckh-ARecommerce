import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import "../assets/styles/pages/AdminCoupon.scss";
import {
  createCoupon,
  deleteCoupon,
  getCouponPaginate,
} from "../api/couponApi";
import useAuth from "../hooks/UseAuth";
import useLoading from "../hooks/UseLoading";
import { formatToVNDateDMY, formatToVNDateYMD } from "../utils/ultils";

const pageSize = 5;
const AdminCoupon = () => {
  // State quản lý danh sách coupon
  const [coupons, setCoupons] = useState([]);

  // State cho form thêm/sửa coupon
  const [formData, setFormData] = useState({
    id: null,
    code: "",
    discountValue: "",
    discountType: "PERCENTAGE",
    minimumOrderAmount: "",
    maxUsage: "",
    couponEndDate: "",
    status: "active",
    couponDescription: "",
  });

  // State cho chế độ chỉnh sửa
  const [editMode, setEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const { token } = useAuth();
  const { setLoading } = useLoading();
  // State cho bộ lọc
  const [filter, setFilter] = useState({ status: "all" });

  // Lấy ngày hiện tại dưới định dạng YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Options cho react-select
  const typeOptions = [
    { value: "PERCENTAGE", label: "Phần Trăm (%)" },
    { value: "ORDER_VALUE_BASED", label: "Số Tiền (VNĐ)" },
  ];

  const filterStatusOptions = [
    { value: "all", label: "Tất Cả" },
    { value: "active", label: "Đang Hoạt Động" },
    { value: "inactive", label: "Không Hoạt Động" },
  ];

  const fetchCoupon = async () => {
    setLoading(true);
    const data = await getCouponPaginate(currentPage, pageSize, token);

    if (data) {
      setCoupons(data.content);
      setTotalPage(data.totalPages);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCoupon();
    console.log(coupons);
  }, [currentPage]);

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi select trong form
  const handleSelectChange = (selectedOption, { name }) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });
  };

  // Xử lý thay đổi select trong filter
  const handleFilterSelectChange = (selectedOption, { name }) => {
    setFilter({
      ...filter,
      [name]: selectedOption.value,
    });
  };

  // Xác thực form trước khi submit
  const validateForm = () => {
    let isValid = true;

    if (!(formData.code.length >= 6 && formData.code.length <= 12)) {
      toast.error("Mã coupon tối thiểu 6 và tối đa 12 ký tự");
      isValid = false;
    }

    // Kiểm tra ngày hết hạn phải sau ngày hôm nay
    if (formData.couponEndDate <= today) {
      toast.error("Ngày hết hạn phải sau ngày hôm nay");
      isValid = false;
    }

    // Kiểm tra giá trị giảm giá
    if (
      formData.discountType === "PERCENTAGE" &&
      (formData.discountValue <= 0 || formData.discountValue > 100)
    ) {
      toast.error("Giá trị phần trăm phải từ 1-100");
      isValid = false;
    } else if (formData.discountValue <= 0) {
      toast.error("Giá trị giảm giá phải lớn hơn 0");
      isValid = false;
    }

    // Kiểm tra số tiền tối thiểu khi loại là amount
    if (
      formData.discountType === "ORDER_VALUE_BASED" &&
      (!formData.minimumOrderAmount || formData.minimumOrderAmount <= 0)
    ) {
      toast.error("Vui lòng nhập số tiền tối thiểu lớn hơn 0");
      isValid = false;
    } else if (
      formData.discountType === "ORDER_VALUE_BASED" &&
      formData.minimumOrderAmount <= formData.discountValue
    ) {
      toast.error("Số tiền giảm giá không được lớn hơn số tiền gốc");
      isValid = false;
    }

    // Kiểm tra số lần sử dụng tối đa
    if (!formData.maxUsage || formData.maxUsage <= 0) {
      toast.error("Số lần sử dụng tối đa phải lớn hơn 0");
      isValid = false;
    }

    return isValid;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác thực form
    if (!validateForm()) {
      return;
    }

    if (editMode) {
      // const dataUpdateCoupon = {
      //     code: formData.code,
      //     couponDescription: formData.couponDescription,
      //     discountType: formData.discountType,
      //     discountValue: formData.discountValue,
      //     minimumOrderAmount: formData.minimumOrderAmount,
      //     maxUsage: formData.maxUsage,
      //     couponStartDate: new Date(),
      //     couponEndDate: new Date(formData.couponEndDate),
      //   };

      //   await createCoupon(dataCreateCoupon, token);
      setEditMode(false);
    } else {
      const dataCreateCoupon = {
        code: formData.code,
        couponDescription: formData.couponDescription,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minimumOrderAmount: formData.minimumOrderAmount,
        maxUsage: formData.maxUsage,
        couponStartDate: new Date(),
        couponEndDate: new Date(formData.couponEndDate),
      };

      await createCoupon(dataCreateCoupon, token);
    }
    fetchCoupon();
    resetForm();
  };

  // Xử lý chỉnh sửa coupon
  const handleEdit = (coupon) => {
    setFormData(coupon);
    setEditMode(true);
  };

  // Xử lý xóa coupon
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      await deleteCoupon(id, token);

      fetchCoupon();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: null,
      code: "",
      discountValue: "",
      discountType: "PERCENTAGE",
      minimumOrderAmount: "",
      maxUsage: "",
      couponEndDate: formatToVNDateYMD(new Date()),
      status: "active",
      couponDescription: "",
    });
    setEditMode(false);
  };

  // Custom styles cho react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "38px",
      border: "1px solid #ddd",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #4a90e2",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4a90e2"
        : state.isFocused
        ? "#f0f0f0"
        : null,
      color: state.isSelected ? "white" : "#333",
    }),
  };

  // Format số tiền thành định dạng VND
  const formatCurrency = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPage) {
      setCurrentPage(newPage);
    }
  };

  // Tạo mảng các trang để hiển thị
  const getPaginationButtons = () => {
    const buttons = [];

    // Luôn hiển thị trang đầu
    buttons.push(
      <button
        key="first"
        className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
        onClick={() => handlePageChange(1)}
      >
        1
      </button>
    );

    // Nếu có nhiều trang
    if (totalPage > 1) {
      // Nếu trang hiện tại > 3, hiển thị dấu ...
      if (currentPage > 3) {
        buttons.push(
          <span key="ellipsis1" className="pagination-ellipsis">
            ...
          </span>
        );
      }

      // Hiển thị các trang xung quanh trang hiện tại
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPage - 1, currentPage + 1);
        i++
      ) {
        if (i !== 1 && i !== totalPage) {
          buttons.push(
            <button
              key={i}
              className={`pagination-button ${
                currentPage === i ? "active" : ""
              }`}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </button>
          );
        }
      }

      // Nếu trang hiện tại < totalPage - 2, hiển thị dấu ...
      if (currentPage < totalPage - 2) {
        buttons.push(
          <span key="ellipsis2" className="pagination-ellipsis">
            ...
          </span>
        );
      }

      // Luôn hiển thị trang cuối
      if (totalPage > 1) {
        buttons.push(
          <button
            key="last"
            className={`pagination-button ${
              currentPage === totalPage ? "active" : ""
            }`}
            onClick={() => handlePageChange(totalPage)}
          >
            {totalPage}
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="admin-coupon-container">
      <h1 className="admin-coupon-title">Quản Lý Mã Giảm Giá</h1>

      {/* Form thêm/sửa coupon */}
      <div className="coupon-form-container">
        <h2>{editMode ? "Chỉnh Sửa Mã Giảm Giá" : "Thêm Mã Giảm Giá Mới"}</h2>
        <form onSubmit={handleSubmit} className="coupon-form">
          <div className="form-group">
            <label htmlFor="code">Mã Giảm Giá:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discountValue">Giá Trị:</label>
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="discountType">Loại:</label>
            <Select
              id="discountType"
              name="discountType"
              options={typeOptions}
              value={typeOptions.find(
                (option) => option.value === formData.discountType
              )}
              onChange={(option, action) => handleSelectChange(option, action)}
              styles={customSelectStyles}
            />
          </div>

          {/* Hiển thị trường nhập số tiền tối thiểu chỉ khi loại là amount */}
          {formData.discountType === "ORDER_VALUE_BASED" && (
            <div className="form-group">
              <label htmlFor="minimumOrderAmount">
                Số Tiền Tối Thiểu (VNĐ):
              </label>
              <input
                type="number"
                id="minimumOrderAmount"
                name="minimumOrderAmount"
                value={formData.minimumOrderAmount}
                onChange={handleInputChange}
                placeholder="Nhập số tiền tối thiểu của đơn hàng"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="maxUsage">Số Lần Sử Dụng Tối Đa:</label>
            <input
              type="number"
              id="maxUsage"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleInputChange}
              placeholder="Nhập số lần sử dụng tối đa"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="couponEndDate">Có Hiệu Lực Đến:</label>
            <input
              type="date"
              id="couponEndDate"
              name="couponEndDate"
              value={formatToVNDateYMD(formData.couponEndDate)}
              onChange={handleInputChange}
              min={today} // Đặt giá trị tối thiểu là ngày hôm nay
              required
            />
          </div>

          <div className="form-group description-field">
            <label htmlFor="couponDescription">Mô Tả:</label>
            <textarea
              id="couponDescription"
              name="couponDescription"
              value={formData.couponDescription}
              onChange={handleInputChange}
              placeholder="Nhập mô tả về mã giảm giá này..."
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editMode ? "Cập Nhật" : "Thêm Mới"}
            </button>
            {editMode && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Bộ lọc */}
      <div className="filter-container">
        <h3>Lọc Mã Giảm Giá</h3>
        <div className="filter-options">
          <div className="filter-group">
            <label htmlFor="status-filter">Trạng Thái:</label>
            <Select
              id="status-filter"
              name="status"
              options={filterStatusOptions}
              value={filterStatusOptions.find(
                (option) => option.value === filter.status
              )}
              onChange={(option, action) =>
                handleFilterSelectChange(option, action)
              }
              styles={customSelectStyles}
              className="filter-select"
            />
          </div>
        </div>
      </div>

      {/* Bảng danh sách coupon */}
      <div className="coupon-list-container">
        <h2>Danh Sách Mã Giảm Giá ({coupons.length})</h2>
        {coupons.length > 0 ? (
          <table className="coupon-table">
            <thead>
              <tr>
                <th>Mã Giảm Giá</th>
                <th>Giá Trị</th>
                <th>Loại</th>
                <th>Số Tiền Tối Thiểu</th>
                <th>Sử Dụng Tối Đa</th>
                <th>Đã sử dụng</th>
                <th>Mô Tả</th>
                <th>Có Hiệu Lực Đến</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id}>
                  <td>{coupon.code}</td>
                  <td>{coupon.discountValue}</td>
                  <td>{coupon.discountType === "PERCENTAGE" ? "%" : "VNĐ"}</td>
                  <td>
                    {coupon.discountType === "ORDER_VALUE_BASED"
                      ? formatCurrency(coupon.minimumOrderAmount)
                      : "N/A"}
                  </td>
                  <td>{coupon.maxUsage}</td>
                  <td>{coupon.timeUsed}</td>
                  <td className="description-cell">
                    {coupon?.couponDescription?.length > 50
                      ? `${coupon?.couponDescription?.substring(0, 50)}...`
                      : coupon?.couponDescription}
                  </td>
                  <td>{formatToVNDateDMY(coupon.couponEndDate)}</td>

                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(coupon)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-coupons">
            Không có mã giảm giá nào phù hợp với điều kiện lọc.
          </div>
        )}

        {/* Phân trang */}
        {coupons.length > 0 && (
          <div className="pagination-container">
            <button
              className="pagination-nav"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Trước
            </button>

            <div className="pagination-buttons">{getPaginationButtons()}</div>

            <button
              className="pagination-nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
            >
              Sau &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupon;
