package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.user.UserAddressCreateRequest;
import com.ecommerce.vn.dto.user.UserAddressResponse;
import com.ecommerce.vn.dto.user.UserAddressUpdateRequest;
import com.ecommerce.vn.entity.user.UserAddress;
import com.ecommerce.vn.service.convert.UserAdressConvert;
import com.ecommerce.vn.service.user.UserAddressService;

@RestController
@RequestMapping("api/v1/user-address")
public class UserAddressController {
	
	@Autowired
	public UserAddressService userAddressService;
	
	@Autowired
	public UserAdressConvert userAdressConvert;
	
	@PostMapping
	public ResponseEntity<UserAddressResponse> createUserAddress(@RequestBody UserAddressCreateRequest userAddressCreateRequest){
		UserAddress userAddress = userAdressConvert.userAddressCreateRequestConvert(userAddressCreateRequest);
		
		userAddress = userAddressService.createUserAddress(userAddress);
		
		UserAddressResponse userAddressResponse = userAdressConvert.userAddressConvertToUsserAddressReponse(userAddress);
		
		return ResponseEntity.ok(userAddressResponse);
	}
	
	@PutMapping
	public ResponseEntity<UserAddressResponse> updateUserAddress(@RequestBody UserAddressUpdateRequest userAddressUpdateRequest){
		UserAddress userAddress = userAdressConvert.addressUpdateRequestConvert(userAddressUpdateRequest);
		
		userAddress = userAddressService.updateUserAddress(userAddress);
		
		UserAddressResponse userAddressResponse = userAdressConvert.userAddressConvertToUsserAddressReponse(userAddress);
		
		return ResponseEntity.ok(userAddressResponse);
	}
	
	@GetMapping("/{useraddressId}")
	public ResponseEntity<UserAddressResponse> getUserAddressById(@PathVariable("useraddressId") UUID useraddressId){		
		UserAddress userAddress = userAddressService.getUserAddressById(useraddressId);
		
		UserAddressResponse userAddressResponse = userAdressConvert.userAddressConvertToUsserAddressReponse(userAddress);
		
		return ResponseEntity.ok(userAddressResponse);
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<UserAddressResponse>> getUserAddressByUserId(@PathVariable("userId") UUID userId){		
		List<UserAddress> userAddresses = userAddressService.getUserAddressByUser(userId);
		
		List<UserAddressResponse> userAddressesResponse = userAddresses
				.stream()
				.map((userAddress) -> userAdressConvert.userAddressConvertToUsserAddressReponse(userAddress))
				.toList();
	
		
		return ResponseEntity.ok(userAddressesResponse);
	}
	
	@DeleteMapping("/{useraddressId}")
	public ResponseEntity<String> deleteUserAddress(@PathVariable("useraddressId") UUID useraddressId){		
		userAddressService.deleteUserAddress(useraddressId);
		return ResponseEntity.ok("Delete success!");
	}
}
