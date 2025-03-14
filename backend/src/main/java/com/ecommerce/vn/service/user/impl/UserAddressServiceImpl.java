package com.ecommerce.vn.service.user.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.user.UserAddress;
import com.ecommerce.vn.repository.UserAddressRepository;
import com.ecommerce.vn.service.user.UserAddressService;

@Service
public class UserAddressServiceImpl implements UserAddressService{
	
	@Autowired
	public UserAddressRepository  userAddressRepository;

	@Override
	@Transactional
	public UserAddress createUserAddress(UserAddress userAddress) {
		
		return userAddressRepository.save(userAddress);
	}

	@Override
	@Transactional
	public UserAddress updateUserAddress(UserAddress userAddress) {
		if(userAddress.getId() == null) {
			throw new RuntimeException("UserAddress id missing");
		}
		return userAddressRepository.save(userAddress);
	}

	@Override
	@Transactional
	public UserAddress getUserAddressById(UUID userAddressId) {
		if(userAddressId == null) {
			throw new RuntimeException("UserAddress id missing");
		}
		return userAddressRepository.findById(userAddressId).orElseThrow(() -> 
				new RuntimeException("Can not found UserAddress with id:" + userAddressId));
	}

	@Override
	@Transactional
	public void deleteUserAddress(UUID userAddressId) {
		UserAddress userAddress = getUserAddressById(userAddressId);
		userAddressRepository.delete(userAddress);
	}

	@Override
	@Transactional
	public List<UserAddress> getUserAddressByUser(UUID userId) {
		if(userId == null) {
			throw new RuntimeException("userId missing");
		}
		return userAddressRepository.getUserAddressesByUser(userId);
	}

}
