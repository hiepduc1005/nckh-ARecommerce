package com.ecommerce.vn.config;

import java.security.SecureRandom;

public class Utils {
	private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LENGTH = 12;

	public static String generateSecureRandomString() {
		SecureRandom secureRandom = new SecureRandom();
		StringBuilder sb = new StringBuilder(LENGTH);
		
		for(int i = 0 ; i < LENGTH ; i++ ) {
			sb.append(CHARACTERS.charAt(secureRandom.nextInt(CHARACTERS.length())));
		}
		
		return sb.toString();
	}
	
	public static String gennerateOTP() {
		SecureRandom secureRandom = new SecureRandom();
		
		StringBuilder randomNumbers = new StringBuilder();
		for(int i=0 ; i < 6 ; i++) {
			int randomDigit = secureRandom.nextInt(0, 9);
			randomNumbers.append(randomDigit);
		}
		
		return randomNumbers.toString();
		
	}
}
