package com.ecommerce.vn.service.wishlist;

import java.util.UUID;

import com.ecommerce.vn.entity.wishlist.WishListItem;

public interface WishListItemService {

	WishListItem createWishListItem(WishListItem wishListItem);
	WishListItem getWishListItemById(UUID wishListItemId );
	void deleteWishListItem(UUID wishListItemId);
	
}
