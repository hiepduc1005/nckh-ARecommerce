import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import "../assets/styles/pages/AdminUser.scss";
import useAuth from "../hooks/UseAuth";
import { getUsers } from "../api/userApi";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    active: null,
    page: 0,
    size: 8,
  });
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    size: 8,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  });
  const [activeFilter, setActiveFilter] = useState("all");

  const { user, token } = useAuth();

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(searchParams, token);
      setUsers(response.content);
      setPagination(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUsers();
    }
  }, [searchParams]);

  // Handle search
  const handleSearch = (value) => {
    setSearchParams((prev) => ({
      ...prev,
      keyword: value,
      page: 0,
    }));
  };

  // Handle filter
  const handleFilter = (filterType) => {
    setActiveFilter(filterType);
    let activeValue = null;
    if (filterType === "active") activeValue = true;
    if (filterType === "inactive") activeValue = false;

    setSearchParams((prev) => ({
      ...prev,
      active: activeValue,
      page: 0,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get role badges
  const getRoleBadges = (roles) => {
    return roles.map((role) => (
      <span
        key={role.id}
        className={`role-badge ${role.roleName.toLowerCase()}`}
      >
        {role.roleName}
      </span>
    ));
  };

  return (
    <div className="user-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Users className="header-icon" />
            <div>
              <h1>Quản lý tài khoản</h1>
              <p>Quản lý thông tin người dùng trong hệ thống</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-number">{pagination.totalElements}</div>
            <div className="stat-label">Tổng người dùng</div>
          </div>
          <Users className="stat-icon" />
        </div>
        <div className="stat-card active-stat">
          <div className="stat-content">
            <div className="stat-number">
              {users.filter((u) => u.active).length}
            </div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
          <div className="stat-indicator active"></div>
        </div>
        <div className="stat-card inactive-stat">
          <div className="stat-content">
            <div className="stat-number">
              {users.filter((u) => !u.active).length}
            </div>
            <div className="stat-label">Tạm khóa</div>
          </div>
          <div className="stat-indicator inactive"></div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username hoặc email..."
            value={searchParams.keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => handleFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "active" ? "active" : ""
            }`}
            onClick={() => handleFilter("active")}
          >
            Hoạt động
          </button>
          <button
            className={`filter-btn ${
              activeFilter === "inactive" ? "active" : ""
            }`}
            onClick={() => handleFilter("inactive")}
          >
            Tạm khóa
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Thông tin liên hệ</th>
                <th>Trạng thái</th>
                <th>Điểm thưởng</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user?.firstname?.charAt(0) ||
                          user?.userName?.charAt(0)}
                        {user?.lastname?.charAt(0)}
                      </div>
                      <div className="user-details">
                        <div className="user-name">
                          {user?.firstname} {user?.lastname}
                        </div>
                        <div className="user-username">@{user.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                      <div className="contact-item">
                        <Phone size={14} />
                        <span>{user.phoneNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.active ? "active" : "inactive"
                      }`}
                    >
                      {user.active ? "Hoạt động" : "Tạm khóa"}
                    </span>
                  </td>
                  <td>
                    <div className="loyalty-points">
                      {user?.loyaltyPoint?.toLocaleString()} điểm
                    </div>
                  </td>
                  <td>
                    <div className="roles">{getRoleBadges(user.roles)}</div>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn view-btn"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="action-btn edit-btn" title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete-btn" title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && users.length === 0 && (
          <div className="empty-state">
            <Users size={64} />
            <h3>Không tìm thấy người dùng</h3>
            <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {pagination.number * pagination.size + 1} -{" "}
            {Math.min(
              (pagination.number + 1) * pagination.size,
              pagination.totalElements
            )}
            của {pagination.totalElements} kết quả
          </div>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={pagination.first}
              onClick={() => handlePageChange(pagination.number - 1)}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-number ${
                  i === pagination.number ? "active" : ""
                }`}
                onClick={() => handlePageChange(i)}
              >
                {i + 1}
              </button>
            )).slice(
              Math.max(0, pagination.number - 2),
              Math.min(pagination.totalPages, pagination.number + 3)
            )}

            <button
              className="pagination-btn"
              disabled={pagination.last}
              onClick={() => handlePageChange(pagination.number + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
