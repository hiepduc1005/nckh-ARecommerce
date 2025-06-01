package com.ecommerce.vn.entity.wishlist;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ecommerce.vn.entity.product.Variant;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class WishListItem {

	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
	
	@ManyToOne
	@JoinColumn(name = "variant_id")
	private Variant variant;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wishlist_id")
	private WishList wishlist;
	
	@CreatedDate
	private LocalDateTime addedAt;

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Variant getVariant() {
		return variant;
	}

	public void setVariant(Variant variant) {
		this.variant = variant;
	}

	public LocalDateTime getAddedAt() {
		return addedAt;
	}

	public void setAddedAt(LocalDateTime addedAt) {
		this.addedAt = addedAt;
	}

	public WishList getWishlist() {
		return wishlist;
	}

	public void setWishlist(WishList wishlist) {
		this.wishlist = wishlist;
	}
	
	

}
