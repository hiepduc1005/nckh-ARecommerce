import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/pages/ForgotPassword.scss";
import { toast } from "react-toastify";
import { requestForgotPassword, verifyForgotPassword } from "../api/userApi";
import { isValidEmail } from "../utils/ultils";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // OTP inputs
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Setup input refs
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if(!isValidEmail(identifier)){
      toast.error("Email không hợp lệ!")
      return;
    }

    const dataRequest = {
      email: identifier
    }
    const res = await requestForgotPassword(dataRequest)

    if(res.status === 200){
      setMessage("Nếu thông tin hợp lệ, bạn sẽ nhận được OTP để đặt lại mật khẩu.");
      setOtpSent(true);
      setResendTimer(60);
      setCanResend(false);
      setIsSubmitting(false);
      
      // Focus vào ô OTP đầu tiên sau khi chuyển sang màn hình OTP
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);

      return;
    }else {
      toast.error("Không thể gửi mã OTP")
      return;
    }
    
  
  };

  const handleOtpChange = (index, value) => {
    // Chỉ cho phép nhập số
    if (value && !/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Tự động focus vào ô tiếp theo nếu đã nhập giá trị
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Xử lý nút Backspace
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Xử lý các phím điều hướng
    else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1].focus();
    } 
    else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otpValues.join("");
    
    // Kiểm tra xem đã nhập đủ OTP chưa
    if (otpString.length !== 6) {
      toast.warn("Vui lòng nhập đầy đủ mã OTP 6 số");
      return;
    }
    if(!isValidEmail(identifier)){
      toast.error("Email không hợp lệ!")
      return;
    }

    const dataVerify = {
      email: identifier,
      otp: otpString,
    }
    const data = await verifyForgotPassword(dataVerify)
    if (data && data?.token) {
      toast.success("Xác thực OTP thành công. Đang chuyển đến trang đặt lại mật khẩu...");
      setTimeout(() => {
        navigate(`/reset-password?t=${data.token}`,{
          state: { identifier }
        });
      }, 1000);
    } else {
      console.log(data)
      toast.error(data?.message || "Mã OTP không đúng. Vui lòng thử lại.");
    }
  };

  const handleResendOtp = () => {
    if (canResend) {
      setMessage("Mã OTP mới đã được gửi.");
      setResendTimer(60);
      setCanResend(false);
      // Reset OTP fields
      setOtpValues(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    
    // Kiểm tra xem dữ liệu dán có phải là số và có độ dài hợp lệ không
    if (!/^\d+$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split("");
    const newOtpValues = [...otpValues];
    
    digits.forEach((digit, index) => {
      if (index < 6) newOtpValues[index] = digit;
    });
    
    setOtpValues(newOtpValues);
    
    // Focus vào ô cuối cùng được điền hoặc ô tiếp theo cần điền
    const focusIndex = Math.min(digits.length, 5);
    if (inputRefs.current[focusIndex]) {
      inputRefs.current[focusIndex].focus();
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>{otpSent ? "Verify" : "QUÊN MẬT KHẨU"}</h2>
        <p>{otpSent ? "Your code was sent to you via email" : "Vui lòng nhập email hoặc số điện thoại để lấy lại tài khoản:"}</p>
        
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
            <div className="otp-input-container" onPaste={handlePaste}>
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  className="otp-input"
                  value={value}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete="off"
                />
              ))}
            </div>
            
            <div className="button-group">
              <button type="submit" className="verify-button">Verify</button>
            </div>
            
            <div className="resend-otp">
              <span>Didn't receive code? </span>
              <button 
                className="request-again-btn" 
                onClick={handleResendOtp} 
                disabled={!canResend}
              >
                {canResend ? "Request again" : `Request again (${resendTimer}s)`}
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