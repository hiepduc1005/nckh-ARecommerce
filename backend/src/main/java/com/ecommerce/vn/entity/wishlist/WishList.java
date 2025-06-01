package com.ecommerce.vn.entity.wishlist;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.ecommerce.vn.entity.user.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "wishlist")
@EntityListeners(AuditingEntityListener.class)
public class WishList {

	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
	
	@OneToOne
	@JoinColumn(name = "user_id")
    private User user;
	
	@OneToMany(cascade = CascadeType.ALL,orphanRemoval = true,mappedBy = "wishlist")
	private List<WishListItem> wishListItems = new ArrayList<>();

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<WishListItem> getWishListItems() {
		return wishListItems;
	}

	public void setWishListItems(List<WishListItem> wishListItems) {
		this.wishListItems = wishListItems;
	}
	
	
}
