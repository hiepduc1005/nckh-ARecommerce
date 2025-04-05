package com.ecommerce.vn.service.otp.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.config.Utils;
import com.ecommerce.vn.entity.OTP;
import com.ecommerce.vn.repository.OTPRepository;
import com.ecommerce.vn.service.otp.OTPService;

import jakarta.transaction.Transactional;

@Service
public class OTPServiceImpl implements OTPService{
	private static final int EXPIRE = 5;
	
	@Autowired
	private OTPRepository otpRepository;
	
	

	@Override
	@Transactional
	public OTP generateOTPWithEmail(String email) {
		OTP otp = getOTPByEmail(email);
		
		String randomOtp = Utils.gennerateOTP();
		
		if(otp == null) {
			OTP newOTP = new OTP();
			newOTP.setCode(randomOtp);
			newOTP.setEmail(email);
			newOTP.setExpireAt(LocalDateTime.now().plusMinutes(EXPIRE));

			newOTP = otpRepository.save(newOTP);
			return newOTP;
		}
		
		otp.setCode(randomOtp);
		otp.setExpireAt(LocalDateTime.now().plusMinutes(EXPIRE));
		
		otp = otpRepository.save(otp);

		return otp;
	}

	@Override
	@Transactional
	public OTP getOTPByEmail(String email) {
		if(email == null || email.isEmpty()) {
			throw new RuntimeException("Email must not null or empty");
		}
		
		return otpRepository.getOTPByEmail(email).orElse(null);
	}

	@Override
	@Transactional
	public boolean verifyOTP(String email, String otpCode) {
		OTP otp = getOTPByEmail(email);
		
		if(otp == null || !otp.getCode().trim().equals(otpCode.trim()) || otp.getExpireAt().isBefore(LocalDateTime.now())) {
			return false;
		}
		
		return true;
	}
	
	

}
