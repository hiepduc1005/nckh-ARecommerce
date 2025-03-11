package com.ecommerce.vn.service.convert;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.cart.CartItemResponse;
import com.ecommerce.vn.dto.cart.CartResponse;
import com.ecommerce.vn.entity.cart.Cart;


@Service
public class CartConvert {
	
	@Autowired
	private CouponConvert couponConvert;
	
	@Autowired
	private CartItemConvert cartItemConvert;

	public CartResponse cartConvertToCartResponse(Cart cart) {
		CartResponse cartResponse = new CartResponse();
		cartResponse.setId(cart.getId());
		cartResponse.setUserId(cart.getUser().getId());
		cartResponse.setCouponResponse(couponConvert.couponConvertToCouponResponse(cart.getCoupon()));
		
		List<CartItemResponse> cartItemResponses = cart.getCartItems().stream()
				.map(
						(cartItem) -> cartItemConvert.cartItemConvertToCartItemResponse(cartItem))
				.toList(); 
		
		double totalPrice = cartItemResponses.stream().mapToDouble(cartItem -> {
		    int quantity = cartItem.getQuantity();
		    BigDecimal discountPriceObj = cartItem.getVariantResponse().getDiscountPrice(); // Lấy object để kiểm tra null
		    BigDecimal priceObj = cartItem.getVariantResponse().getPrice();

		    double discountPrice = (discountPriceObj != null) ? discountPriceObj.doubleValue() : 0.0;
		    double price = (priceObj != null) ? priceObj.doubleValue() : 0.0;

		    if (discountPrice > 0) {
		        return quantity * discountPrice;
		    }
		    return quantity * price;
		}).sum();

		cartResponse.setTotalPrice(totalPrice);
		cartResponse.setCartItemResponses(cartItemResponses);
		
		return cartResponse;
	}
}
