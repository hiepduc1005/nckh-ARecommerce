// Dashboard.jsx
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  User,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  Bell,
  Settings,
  Eye,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import "../assets/styles/pages/AdminDashboard.scss";

const AdminDashboard = () => {
  const salesData = [
    { name: "Tháng 1", sales: 4000, profit: 2400 },
    { name: "Tháng 2", sales: 3000, profit: 1398 },
    { name: "Tháng 3", sales: 2000, profit: 9800 },
    { name: "Tháng 4", sales: 2780, profit: 3908 },
    { name: "Tháng 5", sales: 1890, profit: 4800 },
    { name: "Tháng 6", sales: 2390, profit: 3800 },
    { name: "Tháng 7", sales: 3490, profit: 4300 },
  ];

  const trafficData = [
    { name: "Tháng 1", users: 100 },
    { name: "Tháng 2", users: 150 },
    { name: "Tháng 3", users: 200 },
    { name: "Tháng 4", users: 180 },
    { name: "Tháng 5", users: 220 },
    { name: "Tháng 6", users: 250 },
    { name: "Tháng 7", users: 300 },
    { name: "Tháng 7", users: 300 },
  ];

  const conversionData = [
    { name: "Khách hàng mới", value: 400 },
    { name: "Quay lại", value: 300 },
    { name: "Lần đầu dùng AR", value: 200 },
    { name: "Không dùng AR", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const recentOrders = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      product: "Kính AR Smart Glass",
      date: "10/04/2025",
      price: "12,500,000 VND",
      status: "completed",
    },
    {
      id: 2,
      customer: "Trần Thị B",
      product: "AR Home Decor Set",
      date: "09/04/2025",
      price: "5,200,000 VND",
      status: "pending",
    },
    {
      id: 3,
      customer: "Lê Minh C",
      product: "AR Fashion Trial",
      date: "08/04/2025",
      price: "3,800,000 VND",
      status: "completed",
    },
    {
      id: 4,
      customer: "Phạm Hoàng D",
      product: "AR Gaming Glasses",
      date: "07/04/2025",
      price: "8,900,000 VND",
      status: "cancelled",
    },
    {
      id: 5,
      customer: "Vũ Thị E",
      product: "AR Educational Pack",
      date: "06/04/2025",
      price: "4,300,000 VND",
      status: "pending",
    },
  ];

  const StatCard = ({ icon, title, value, trend, color }) => {
    const Icon = icon;
    return (
      <div className={`stat-card ${color}`}>
        <div className="stat-content">
          <div className="stat-info">
            <p className="stat-title">{title}</p>
            <h3 className="stat-value">{value}</h3>
            <p className={`stat-trend ${trend >= 0 ? "positive" : "negative"}`}>
              <TrendingUp size={16} />
              <span>{trend}% so với tháng trước</span>
            </p>
          </div>
          <div className="stat-icon">
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">Xin chào, Admin</div>
          <div className="header-actions">
            <button className="notification-btn">
              <Bell size={20} />
            </button>
            <div className="avatar">A</div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="dashboard-content">
        <h1 className="dashboard-title">Tổng quan</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            icon={DollarSign}
            title="Tổng doanh thu"
            value="1.25 Tỷ VND"
            trend={12.5}
            color="blue"
          />
          <StatCard
            icon={ShoppingCart}
            title="Tỷ lệ chuyển đổi"
            value="12.8%"
            trend={2.3}
            color="green"
          />
          <StatCard
            icon={User}
            title="Khách hàng mới"
            value="835"
            trend={5.7}
            color="purple"
          />
          <StatCard
            icon={Eye}
            title="Tương tác AR"
            value="4,623"
            trend={8.2}
            color="yellow"
          />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h2 className="chart-title">Doanh thu và lợi nhuận</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" name="Doanh thu" fill="#4f46e5" />
                <Bar dataKey="profit" name="Lợi nhuận" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h2 className="chart-title">Lượng truy cập</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Người dùng"
                  stroke="#4f46e5"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="orders-card">
            <h2 className="chart-title">Đơn hàng gần đây</h2>
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Ngày</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.date}</td>
                      <td>{order.price}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status === "completed"
                            ? "Hoàn thành"
                            : order.status === "pending"
                            ? "Đang xử lý"
                            : "Đã hủy"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="chart-card">
            <h2 className="chart-title">Phân tích khách hàng</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {conversionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="chart-card">
            <h2 className="chart-title">Hiệu quả AR</h2>
            <div className="progress-container">
              <div className="progress-item">
                <div className="progress-header">
                  <span>Tỷ lệ tương tác với AR</span>
                  <span>75%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill blue"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span>Chuyển đổi sau khi dùng AR</span>
                  <span>62%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill green"
                    style={{ width: "62%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span>Thời gian trung bình sử dụng AR</span>
                  <span>5:23 phút</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill purple"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <div className="progress-header">
                  <span>Tỷ lệ đánh giá tốt về AR</span>
                  <span>89%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill yellow"
                    style={{ width: "89%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h2 className="chart-title">Thông báo hệ thống</h2>
            <div className="notification-container">
              <div className="notification-item red">
                <AlertCircle size={20} className="notification-icon" />
                <div className="notification-content">
                  <h3>Dữ liệu AR cần cập nhật</h3>
                  <p>
                    Một số mô hình AR cho dòng sản phẩm mới cần được cập nhật.
                  </p>
                </div>
              </div>
              <div className="notification-item yellow">
                <AlertCircle size={20} className="notification-icon" />
                <div className="notification-content">
                  <h3>Lượng truy cập cao</h3>
                  <p>Hệ thống ghi nhận lượng truy cập cao trong 24h qua.</p>
                </div>
              </div>
              <div className="notification-item green">
                <AlertCircle size={20} className="notification-icon" />
                <div className="notification-content">
                  <h3>Cập nhật hệ thống thành công</h3>
                  <p>
                    Phiên bản mới của phần mềm AR đã được triển khai thành công.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
