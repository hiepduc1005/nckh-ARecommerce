package com.ecommerce.vn.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.config.VnpayConfig;
import com.ecommerce.vn.entity.order.Order;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class VNPayService {
	
	public String createPaymentURL(Order order,HttpServletRequest req) {
		String vnp_RequestId = VnpayConfig.getRandomNumber(8);
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;
        String vnp_TxnRef = order.getCode();
        String vnp_OrderInfo = "Thanh toán đơn hàng: " + vnp_TxnRef + ".";
       
        String vnp_OrderType = "other";
        String vnp_IpAddr = VnpayConfig.getIpAddress(req);
        String vnp_Locale = "vn";
        String vnp_ReturnUrl = VnpayConfig.vnp_ReturnUrl;
        String bankCode = "VNBANK";

        
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        
        int amount = (order.getDiscountPrice() == null || order.getDiscountPrice().intValue() == 0)
                ? (order.getTotalPrice().intValue() * 100)
                : (order.getDiscountPrice().intValue() * 100);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        
        
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append("=").append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII)).append("&");
            }
        }
        hashData.deleteCharAt(hashData.length() - 1); // Xóa ký tự '&' cuối cùng
        
        // Tạo chữ ký
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        vnp_Params.put("vnp_SecureHash", vnp_SecureHash);
        
        // Tạo URL thanh toán
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            query.append(fieldName).append("=").append(URLEncoder.encode(vnp_Params.get(fieldName), StandardCharsets.US_ASCII)).append("&");
        }
        query.append("vnp_SecureHash=").append(vnp_SecureHash);
        
        return VnpayConfig.vnp_PayUrl + "?" + query.toString();

	}

}
