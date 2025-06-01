package com.ecommerce.vn.service.wishlist;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.wishlist.WishList;
import com.ecommerce.vn.entity.wishlist.WishListItem;

public interface WishListService {
	public WishList getOrCreateByUser(User user);
	public List<WishListItem> getItems(UUID wishlistId);
	WishList getWishListById(UUID wishListId);
	void addItem(User user, Variant variant);
	void removeItem(User user, Variant variant);
	void clearWishlist(User user);
	boolean existsInWishlist(User user, Variant variant);

}
