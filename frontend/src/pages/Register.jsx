import React, { useEffect, useState } from "react";
import "../assets/styles/pages/Register.scss";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useAuth from "../hooks/UseAuth";
import useLoading from "../hooks/UseLoading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState("male");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const { setLoading } = useLoading();

  useEffect(() => {
    document.title = "Đăng ký";
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      navigate("/");
      const timeout = setTimeout(() => setLoading(false), 300);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, navigate, setLoading]);

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    register(email, firstName, lastName, password);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="input-group-row">
            <div className="input-group">
              <label>Họ</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                type="text"
                placeholder="Nhập họ"
              />
            </div>
            <div className="input-group">
              <label>Tên</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                type="text"
                placeholder="Nhập tên"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Ngày sinh:</label>
            <DatePicker
              required
              showIcon
              showDateSelect
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày sinh"
            />
          </div>

          <div className="input-group">
            <label>Giới tính:</label>
            <div className="gender-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                <span>Nam</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                <span>Nữ</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === "other"}
                  onChange={() => setGender("other")}
                />
                <span>Tùy chỉnh</span>
              </label>
            </div>
          </div>

          <div className="input-group">
            <label>Nhập số điện thoại hoặc email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
              placeholder="Nhập số điện thoại hoặc email"
            />
          </div>

          <div className="input-group">
            <label>Nhập username:</label>
            <input type="text" required placeholder="Nhập username" />
          </div>

          <div className="input-group password-group">
            <label>Nhập mật khẩu:</label>
            <div className="password-wrapper">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                autoComplete
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="input-group password-group">
            <label>Xác nhận lại mật khẩu:</label>
            <div className="password-wrapper">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                autoComplete
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <p>
            Bằng cách nhấp vào "Tạo tài khoản", bạn đồng ý với{" "}
            <a href="#">Điều khoản</a> và <a href="#">Chính sách bảo mật</a> của
            chúng tôi.
          </p>
          <button type="submit" className="register-btn">
            Tạo tài khoản
          </button>
          <p>
            Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
