import React, { useState } from "react";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";

import "../assets/styles/pages/ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../api/userApi";
import useAuth from "../hooks/UseAuth";
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { user, token } = useAuth();

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const passwordValidation = validatePassword(formData.newPassword);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return false;
    }

    if (!formData.newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return false;
    } else if (!passwordValidation.isValid) {
      toast.error("Mật khẩu không đáp ứng yêu cầu bảo mật");
      return false;
    }

    if (!formData.confirmPassword) {
      toast.error("Vui lòng xác nhận mật khẩu mới");
      return false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!user || !token) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    const data = await changePassword(formData, token);

    if (data) {
      toast.success("Đổi mật khẩu thành công!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
    setIsSubmitting(false);
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className={`requirement ${met ? "met" : "unmet"}`}>
      {met ? <Check size={14} /> : <X size={14} />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <div className="card-header">
          <div className="icon-wrapper">
            <Lock size={24} />
          </div>
          <h1>Đổi Mật Khẩu</h1>
          <p>Vui lòng nhập thông tin để thay đổi mật khẩu của bạn</p>
        </div>

        <div className="password-form">
          <div className="form-group">
            <label htmlFor="currentPassword">
              Mật khẩu hiện tại <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={""}
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              Mật khẩu mới <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className={""}
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {formData.newPassword && (
              <div className="password-requirements">
                <p>Yêu cầu mật khẩu:</p>
                <PasswordRequirement
                  met={passwordValidation.minLength}
                  text="Ít nhất 8 ký tự"
                />
                <PasswordRequirement
                  met={passwordValidation.hasUpper}
                  text="Có chữ hoa"
                />
                <PasswordRequirement
                  met={passwordValidation.hasLower}
                  text="Có chữ thường"
                />
                <PasswordRequirement
                  met={passwordValidation.hasNumber}
                  text="Có số"
                />
                <PasswordRequirement
                  met={passwordValidation.hasSpecial}
                  text="Có ký tự đặc biệt"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Xác nhận mật khẩu mới <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={""}
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="submit-btn"
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Đang xử lý...
              </>
            ) : (
              "Đổi Mật Khẩu"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
