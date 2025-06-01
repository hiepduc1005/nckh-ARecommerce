package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.wishlist.WishListResponse;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.convert.WishListConvert;
import com.ecommerce.vn.service.user.UserService;
import com.ecommerce.vn.service.variant.VariantService;
import com.ecommerce.vn.service.wishlist.WishListService;

@RestController
@RequestMapping("api/v1/wishlist")
public class WishListController {

	@Autowired
	private WishListService wishListService;
	
	@Autowired
	private WishListConvert wishListConvert;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private VariantService variantService;
	
	@GetMapping("/user")
	public ResponseEntity<WishListResponse> getWishListByUser() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
		
		WishListResponse wishListResponse =  wishListConvert.wishListConvertToWishListResponse(wishListService.getOrCreateByUser(user));
	
		return ResponseEntity.ok(wishListResponse);
	}
	
	@PostMapping("/add/{variantId}")
    public ResponseEntity<Void> addItemToWishlist(@PathVariable UUID variantId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
        Variant variant = variantService.getVariantById(variantId);
        wishListService.addItem(user, variant);
        return ResponseEntity.ok().build();
    }
	
	@DeleteMapping("/remove/{variantId}")
    public ResponseEntity<Void> removeItemFromWishlist(@PathVariable UUID variantId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);        
		Variant variant = variantService.getVariantById(variantId);
        wishListService.removeItem(user, variant);
        return ResponseEntity.ok().build();
    } 
	
	@DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist() {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);        
		wishListService.clearWishlist(user);
        return ResponseEntity.ok().build();
    }
	
	@GetMapping("/exists/{variantId}")
    public ResponseEntity<Boolean> existsInWishlist(@PathVariable UUID variantId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);  
        Variant variant = variantService.getVariantById(variantId);
        boolean exists = wishListService.existsInWishlist(user, variant);
        return ResponseEntity.ok(exists);
    }
	
	
}
