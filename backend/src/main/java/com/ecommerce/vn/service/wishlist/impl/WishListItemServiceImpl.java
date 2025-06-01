package com.ecommerce.vn.service.wishlist.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.wishlist.WishListItem;
import com.ecommerce.vn.repository.WishListItemRepository;
import com.ecommerce.vn.service.wishlist.WishListItemService;

import jakarta.transaction.Transactional;

@Service
public class WishListItemServiceImpl implements WishListItemService{
	
	@Autowired
	private WishListItemRepository wishListItemRepository;

	@Override
	@Transactional
	public WishListItem createWishListItem(WishListItem wishListItem) {
		if(wishListItem.getId() != null) {
			throw new RuntimeException("Wishlist item already exist!");
		}
		return wishListItemRepository.save(wishListItem);
	}

	@Override
	@Transactional
	public WishListItem getWishListItemById(UUID wishListItemId) {
		if(wishListItemId == null) {
			throw new RuntimeException("Wishlist is null");
		}		
		
		return wishListItemRepository.findById(wishListItemId).orElseThrow(() 
				-> new RuntimeException("Not found wishlist item with id: " + wishListItemId));
	}

	@Override
	@Transactional
	public void deleteWishListItem(UUID wishListItemId) {
		WishListItem wishListItem = getWishListItemById(wishListItemId);
		
		wishListItemRepository.delete(wishListItem);
	}

}
