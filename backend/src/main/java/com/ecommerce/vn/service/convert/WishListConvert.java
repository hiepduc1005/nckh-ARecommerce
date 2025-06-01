package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.wishlist.WishListItemResponse;
import com.ecommerce.vn.dto.wishlist.WishListResponse;
import com.ecommerce.vn.entity.wishlist.WishList;
import com.ecommerce.vn.entity.wishlist.WishListItem;

@Service
public class WishListConvert {
	
	@Autowired
	public VariantConvert variantConvert;

	public WishListResponse wishListConvertToWishListResponse(WishList wishList) {
		WishListResponse wishListResponse = new WishListResponse();
		wishListResponse.setId(wishList.getId());
		wishListResponse.setUserId(wishList.getUser().getId());
		wishListResponse.setWishListItems(wishList.getWishListItems()
				.stream()
				.map(wishListItem -> wishListItemConvertToWishListItemResponse(wishListItem))
				.toList()
				);
		
		return wishListResponse;
	}
	
	public WishListItemResponse wishListItemConvertToWishListItemResponse(WishListItem wishListItem) {
		WishListItemResponse wishListItemResponse = new WishListItemResponse();
		wishListItemResponse.setId(wishListItem.getId());
		wishListItemResponse.setWishListId(wishListItem.getWishlist().getId());
		wishListItemResponse.setAddedAt(wishListItem.getAddedAt());
		wishListItemResponse.setVariantResponse(variantConvert.variantConvertToVariantResponse(wishListItem.getVariant()));
		
		return wishListItemResponse;
	}
}
