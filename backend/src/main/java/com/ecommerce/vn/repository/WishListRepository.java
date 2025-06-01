package com.ecommerce.vn.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.wishlist.WishList;

@Repository
public interface WishListRepository extends JpaRepository<WishList, UUID>{

	@Query("SELECT wl FROM WishList wl WHERE wl.user = :user ")
	Optional<WishList> getWishListByUser(@Param("user") User user);
	
}
