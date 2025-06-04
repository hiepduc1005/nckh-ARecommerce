package com.ecommerce.vn.service.wishlist.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.wishlist.WishList;
import com.ecommerce.vn.entity.wishlist.WishListItem;
import com.ecommerce.vn.repository.WishListRepository;
import com.ecommerce.vn.service.cart.CartService;
import com.ecommerce.vn.service.wishlist.WishListService;

import jakarta.transaction.Transactional;

@Service
public class WishListServiceImpl implements WishListService{

	@Autowired
	private WishListRepository wishListRepository;
	
	@Autowired
	private CartService cartService;
	
	@Override
	@Transactional
	public WishList getOrCreateByUser(User user) {
		Optional<WishList> otpWishList = wishListRepository.getWishListByUser(user);
		if(otpWishList.isPresent()) {
			return otpWishList.get();
		}
		
		WishList wishList = new WishList();
		wishList.setUser(user);
		
		return wishListRepository.save(wishList);
	}
	

	@Override
	@Transactional
	public WishList getWishListById(UUID wishListId) {
		// TODO Auto-generated method stub
		return wishListRepository.findById(wishListId).orElseThrow(() -> new RuntimeException("Cant not found wishlist with id " + wishListId));
	}

	@Override
	@Transactional
	public List<WishListItem> getItems(UUID wishlistId) {
		WishList wishList = getWishListById(wishlistId);
		
		return wishList.getWishListItems();
	}

	@Override
	@Transactional
	public void addItem(User user, Variant variant) {
		WishList wishList = getOrCreateByUser(user);
		
		List<WishListItem> wishListItems = wishList.getWishListItems();
		
		boolean exists = wishListItems.stream()
			    .anyMatch(item -> item.getVariant().getId().equals(variant.getId()));

		if (exists) {
		    return; 
		}
		
		WishListItem wishListItem = new WishListItem();
		wishListItem.setVariant(variant);
		wishListItem.setWishlist(wishList);
		
		wishListItems.add(wishListItem);
		
		wishListRepository.save(wishList);
		
	}

	@Override
	@Transactional
	public void removeItem(User user, Variant variant) {
		WishList wishList = getOrCreateByUser(user);
		
		List<WishListItem> wishListItems = wishList.getWishListItems();
		
		wishListItems.removeIf(wishlistItem -> wishlistItem.getVariant().getId().equals(variant.getId()));
				
		wishListRepository.save(wishList);
	}

	@Override
	@Transactional
	public void clearWishlist(User user) {
		WishList wishList = getOrCreateByUser(user);

		wishList.getWishListItems().clear();
	    wishListRepository.save(wishList);
	}

	@Override
	@Transactional
    public boolean existsInWishlist(User user, Variant variant) {
        WishList wishList = getOrCreateByUser(user);
        return wishList.getWishListItems().stream()
            .anyMatch(item -> item.getVariant().getId().equals(variant.getId()));
    }


	@Override
	@Transactional
	public void wishListToCart(WishListItem wishListItem,User user) {
	    Variant variant = wishListItem.getVariant();
	    
	    Cart cart = user.getCart();
	    CartItem cartItem = new CartItem();
	    cartItem.setCart(cart);
	    cartItem.setVariant(variant);
	    cartItem.setQuantity(1);
	    
	    
	    cartService.addItemToCart(cart.getId(), cartItem);
	    removeItem(user, variant);
		
	}




}
