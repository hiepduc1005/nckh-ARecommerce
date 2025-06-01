package com.ecommerce.vn.dto.wishlist;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class WishListResponse {
    private UUID id;
    private UUID userId;
    private List<WishListItemResponse> wishListItems = new ArrayList<>();
	public UUID getId() {
		return id;
	}
	public void setId(UUID id) {
		this.id = id;
	}
	public UUID getUserId() {
		return userId;
	}
	public void setUserId(UUID userId) {
		this.userId = userId;
	}
	public List<WishListItemResponse> getWishListItems() {
		return wishListItems;
	}
	public void setWishListItems(List<WishListItemResponse> wishListItems) {
		this.wishListItems = wishListItems;
	}
    
    

}
