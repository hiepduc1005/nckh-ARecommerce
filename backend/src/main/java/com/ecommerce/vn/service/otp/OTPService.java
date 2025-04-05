package com.ecommerce.vn.service.otp;

import com.ecommerce.vn.entity.OTP;

public interface OTPService {

	OTP generateOTPWithEmail(String email);
	OTP getOTPByEmail(String email);
	boolean verifyOTP(String email, String otpCode);
	
}
