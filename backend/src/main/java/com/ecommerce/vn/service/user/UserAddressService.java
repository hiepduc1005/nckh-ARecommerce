package com.ecommerce.vn.service.user;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.user.UserAddress;

public interface UserAddressService {

	UserAddress createUserAddress(UserAddress userAddress);
	
	UserAddress updateUserAddress(UserAddress userAddress);
	
	UserAddress getUserAddressById(UUID userAddressId);
	
	void deleteUserAddress(UUID userAddressId);
	
	List<UserAddress> getUserAddressByUser(UUID userId);
}
