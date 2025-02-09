import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/ForgotPassword.scss";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () =>  clearInterval(timer);
  }, [otpSent, resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    
    // Giả lập gửi OTP (gọi API thực tế ở đây)
    setTimeout(() => {
      setMessage("Nếu thông tin hợp lệ, bạn sẽ nhận được OTP để đặt lại mật khẩu.");
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Giả lập xác thực OTP
    if (otp === "123456") {
      setMessage("Xác thực OTP thành công. Đang chuyển đến trang đặt lại mật khẩu...");
      setTimeout(() => {
        navigate("/reset-password", { state: { identifier } });
      }, 1000);
    } else {
      setMessage("Mã OTP không đúng. Vui lòng thử lại.");
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setMessage("Mã OTP mới đã được gửi.");
      setResendTimer(60);
      setCanResend(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>QUÊN MẬT KHẨU</h2>
        <p>{otpSent ? "Nhập mã OTP để xác nhận:" : "Vui lòng nhập email hoặc số điện thoại để lấy lại tài khoản:"}</p>
        {!otpSent ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nhập email hoặc số điện thoại"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <div className="button-group">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="button-group">
              <button type="submit">Xác nhận OTP</button>
            </div>
            <div className="resend-otp">
              <button onClick={handleResendOtp} disabled={!canResend}>
                {canResend ? "Gửi lại OTP" : `Gửi lại sau ${resendTimer}s`}
              </button>
            </div>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
