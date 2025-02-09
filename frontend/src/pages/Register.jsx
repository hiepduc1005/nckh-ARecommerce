import React, { useState } from 'react'
import "../assets/styles/pages/Register.scss"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState("male");

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>ĐĂNG KÝ TÀI KHOẢN</h2>
        <form>
          <div className="input-group-row">
            <div className="input-group">
              <label>Họ</label>
              <input required type="text" placeholder="Nhập họ" />
            </div>
            <div className="input-group">
              <label>Tên</label>
              <input required type="text" placeholder="Nhập tên" />
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
            <input type="text" required placeholder="Nhập số điện thoại hoặc email" />
          </div>

          <div className="input-group">
            <label>Nhập username:</label>
            <input type="text" required placeholder="Nhập username" />
          </div>

          <div className="input-group password-group">
            <label>Nhập mật khẩu:</label>
            <div className="password-wrapper">
              <input required type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="input-group password-group">
            <label>Xác nhận lại mật khẩu:</label>
            <div className="password-wrapper">
              <input required type={showConfirmPassword ? "text" : "password"} placeholder="Xác nhận mật khẩu" />
              <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <p>Bằng cách nhấp vào "Tạo tài khoản", bạn đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách bảo mật</a> của chúng tôi.</p>
          <button type="submit"  className="register-btn">Tạo tài khoản</button>
          <p>Bạn đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
        </form>
      </div>
    </div>
  );
};


export default Register