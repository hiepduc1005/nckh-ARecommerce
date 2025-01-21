package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;

import com.ecommerce.vn.dto.cart.CartItemCreateRequest;
import com.ecommerce.vn.dto.cart.CartItemResponse;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.service.variant.VariantService;

public class CartItemConvert {
	@Autowired
	private VariantService variantService;
	
	@Autowired
	private VariantConvert variantConvert;

	public CartItemResponse cartItemConvertToCartItemResponse(CartItem cartItem) {
		CartItemResponse cartItemResponse = new CartItemResponse();
		cartItemResponse.setId(cartItem.getId());
		cartItemResponse.setQuantity(cartItem.getQuantity());
		cartItemResponse.setVariantResponse(variantConvert.variantConvertToVariantResponse(cartItem.getVariant()));
	
		return cartItemResponse;
	}
	
	public CartItem cartItemCreateRequestConvertToCartItem(CartItemCreateRequest cartItemCreateRequest) {
		Variant variant = variantService.getVariantById(cartItemCreateRequest.getVariantId());
		CartItem cartItem = new CartItem();
		cartItem.setQuantity(cartItemCreateRequest.getQuantity());
		cartItem.setVariant(variant);
		
		return cartItem;
	}
}
