package com.ecommerce.vn.service.cart.impl;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.cart.CartItem;
import com.ecommerce.vn.entity.coupon.Coupon;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.CartItemRepository;
import com.ecommerce.vn.repository.CartRepository;
import com.ecommerce.vn.repository.UserRepository;
import com.ecommerce.vn.service.cart.CartService;
import com.ecommerce.vn.service.coupon.CouponService;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;  

    @Autowired
    private UserRepository userRepository;  

    @Autowired
    private CartItemRepository cartItemRepository;  
        
    @Autowired
    private CouponService couponService;
    
    @Override
    public Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Override
    public Cart getCartByUserId(UUID userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return cartRepository.findByUserId(userId);
        }
        throw new RuntimeException("User not found");
    }

    @Override
    @Transactional
    public void addItemToCart(UUID cartId, CartItem cartItem) {
    	Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
    	
    	cartItem.setCart(cart);
        cartItemRepository.save(cartItem);
    	
    }

    @Override
    @Transactional
    public void removeItemFromCart(UUID cartId, UUID cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "cartItemId", cartItemId));

        if (!cartItem.getCart().getId().equals(cartId)) {
            throw new IllegalStateException("CartItem không thuộc về giỏ hàng này");
        }

        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(UUID cartId) {
    	Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));    
    	
    	cart.getCartItems().clear();
    	cartRepository.save(cart);
    }

    @Override
    @Transactional
    public Set<CartItem> getCartItems(UUID cartId) {
    	Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));    
    	
    	return cart.getCartItems();
    }
 
	@Override
	public void updateCartItemQuantity(UUID cartId, UUID cartItemId, int quantity) {
		CartItem cartItem = cartItemRepository.findById(cartItemId)
	            .orElseThrow(() -> new ResourceNotFoundException("CartItem", "cartItemId", cartItemId));
	    
	    if (quantity <= 0) {
	        throw new IllegalArgumentException("Quantity must be greater than zero");
	    }
	    
	    cartItem.setQuantity(quantity);
	    
	    // Lưu lại mục giỏ hàng đã được cập nhật
	    cartItemRepository.save(cartItem);
	}

	@Override
	@Transactional
	public BigDecimal calculateCartTotal(UUID cartId) {
	    Cart cart = cartRepository.findById(cartId)
	            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

	    BigDecimal totalPrice = cart.getCartItems().stream()
	            .map(cartItem -> {
	                Variant variant = cartItem.getVariant();
	                if (variant == null) {
	                    return BigDecimal.ZERO; 
	                }
	                
	                BigDecimal itemPrice = variant.getPrice() != null ? variant.getPrice() : BigDecimal.ZERO; 
	                return itemPrice.multiply(new BigDecimal(cartItem.getQuantity()));
	            })
	            .reduce(BigDecimal.ZERO, BigDecimal::add);
	    
	    if(cart.getCoupon() != null) {
	    	totalPrice = applyCouponDiscount(totalPrice, cart.getCoupon());
	    }

	    return totalPrice;
	}


	@Override
	@Transactional
	public boolean isCartEmpty(UUID cartId) {
		Cart cart = cartRepository.findById(cartId)
	            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));
		
		return cart.getCartItems().isEmpty();
	}
	
	
	 private BigDecimal applyCouponDiscount(BigDecimal totalPrice, Coupon coupon) {
	        BigDecimal discount = BigDecimal.ZERO;
	
	        // Kiểm tra loại giảm giá
	        if (coupon.getDiscountType() != null) {
	            switch (coupon.getDiscountType()) {
	                case PERCENTAGE:
	                    discount = totalPrice.multiply(coupon.getDiscountValue().divide(new BigDecimal(100)));            
	                    break;
	                case FIXED_AMOUNT:
	                    discount = coupon.getDiscountValue();
	                    break;
	                case FREE_SHIPPING:
	                    // Thao tác miễn phí vận chuyển có thể không ảnh hưởng đến tổng giá
	                    break;
	            }
	        }
	
	        return totalPrice.subtract(discount).max(BigDecimal.ZERO); // Đảm bảo tổng không âm
	    }


	@Override
	@Transactional
	public void applyCouponToCart(UUID cartId, String couponCode) {
		Cart cart = cartRepository.findById(cartId)
		            .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

	    Coupon coupon = couponService.validateAndRetrieveCoupon(couponCode,calculateCartTotal(cartId));
	    
	    cart.setCoupon(coupon);
	    cartRepository.save(cart);	
	}

	@Override
	@Transactional
	public int getTotalQuantityInCart(UUID cartId) {
		  Cart cart = cartRepository.findById(cartId)
	                .orElseThrow(() -> new ResourceNotFoundException("Cart", "cartId", cartId));

	        return cart.getCartItems().stream()
	                .mapToInt(CartItem::getQuantity)
	                .sum();
	    
	}
    
}

