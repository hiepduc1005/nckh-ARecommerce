package com.ecommerce.vn.dto.wishlist;

import java.time.LocalDateTime;
import java.util.UUID;

import com.ecommerce.vn.dto.variant.VariantResponse;

public class WishListItemResponse {

	private UUID id;
	private VariantResponse variantResponse;
	private UUID wishListId;
	private LocalDateTime addedAt;
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public VariantResponse getVariantResponse() {
		return variantResponse;
	}
	public void setVariantResponse(VariantResponse variantResponse) {
		this.variantResponse = variantResponse;
	}
	public UUID getWishListId() {
		return wishListId;
	}
	public void setWishListId(UUID wishListId) {
		this.wishListId = wishListId;
	}
	public LocalDateTime getAddedAt() {
		return addedAt;
	}
	public void setAddedAt(LocalDateTime addedAt) {
		this.addedAt = addedAt;
	}
	
	

}
