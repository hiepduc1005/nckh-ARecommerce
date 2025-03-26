package com.ecommerce.vn.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.StringJoiner;
import java.util.TimeZone;
import java.util.TreeMap;

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
        String vnp_Amount = (order.getDiscountPrice() == null || order.getDiscountPrice().intValue() == 0) ? order.getTotalPrice().toString() : order.getDiscountPrice().toString();
        String vnp_OrderType = "other";
        String vnp_IpAddr = VnpayConfig.getIpAddress(req);
        String vnp_Locale = "vn";
        String vnp_ReturnUrl = VnpayConfig.vnp_ReturnUrl;
        String bankCode = req.getParameter("bankCode");

        
        Map<String, String> vnp_Params = new TreeMap<>(); // TreeMap giúp tự động sắp xếp key
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
        vnp_Params.put("vnp_OrderType", vnp_OrderType);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_Locale", vnp_Locale);
        
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
        
        StringJoiner query = new StringJoiner("&");
        StringJoiner hashData = new StringJoiner("&");

        for (Map.Entry<String, String> entry : vnp_Params.entrySet()) {
            String encodedKey = URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII);
            String encodedValue = URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII);
            query.add(encodedKey + "=" + encodedValue);
            hashData.add(entry.getKey() + "=" + entry.getValue());
        }
        
        
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        query.add("vnp_SecureHash=" + URLEncoder.encode(vnp_SecureHash, StandardCharsets.US_ASCII));

        return VnpayConfig.vnp_PayUrl + "?" + query;

	}

}
