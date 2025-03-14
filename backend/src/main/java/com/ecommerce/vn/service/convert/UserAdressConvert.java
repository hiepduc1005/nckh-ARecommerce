package com.ecommerce.vn.service.convert;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.user.UserAddressCreateRequest;
import com.ecommerce.vn.dto.user.UserAddressResponse;
import com.ecommerce.vn.dto.user.UserAddressUpdateRequest;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAddress;
import com.ecommerce.vn.service.user.UserAddressService;

@Service
public class UserAdressConvert {
	
	@Autowired
	public UserAddressService userAddressService;
    
    public UserAddress userAddressCreateRequestConvert(UserAddressCreateRequest userAddressCreateRequest){

        UserAddress userAdress = new UserAddress();
        userAdress.setAddress(userAddressCreateRequest.getAddress());
        userAdress.setDefault(userAddressCreateRequest.isDefault());
        userAdress.setDistrict(userAddressCreateRequest.getDistrict());
        userAdress.setName(userAddressCreateRequest.getName());
        userAdress.setPhone(userAddressCreateRequest.getPhone());
        
        User user = new User(userAddressCreateRequest.getUserId());
        userAdress.setUser(user);

        return userAdress;
    }
    
    public UserAddress addressUpdateRequestConvert(UserAddressUpdateRequest addressUpdateRequest){	
        UserAddress userAdress = userAddressService.getUserAddressById(addressUpdateRequest.getId());
        userAdress.setAddress(addressUpdateRequest.getAddress());
        userAdress.setDefault(addressUpdateRequest.isDefault());
        userAdress.setDistrict(addressUpdateRequest.getDistrict());
        userAdress.setName(addressUpdateRequest.getName());
        userAdress.setPhone(addressUpdateRequest.getPhone());
        userAdress.setId(addressUpdateRequest.getId());
        
        return userAdress;
    }

    public UserAddressResponse userAddressConvertToUsserAddressReponse(UserAddress userAddress){
        if (userAddress == null) {
            return null;
        }

        UserAddressResponse userAddressResponse = new UserAddressResponse();
        userAddressResponse.setAddress(userAddress.getAddress());
        userAddressResponse.setDefault(userAddress.isDefault());
        userAddressResponse.setDistrict(userAddress.getDistrict());
        userAddressResponse.setName(userAddress.getName());
        userAddressResponse.setPhone(userAddress.getPhone());
        userAddressResponse.setId(userAddress.getId());
        userAddressResponse.setUserId(userAddress.getUser().getId());
        
        return userAddressResponse;
    }
}
