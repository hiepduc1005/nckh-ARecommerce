package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.user.UserAddressCreateRequest;
import com.ecommerce.vn.dto.user.UserAddressResponse;
import com.ecommerce.vn.entity.user.UserAddress;

@Service
public class UserAdressConvert {
    
    public UserAddress userAddressCreateRequestConvert(UserAddressCreateRequest userAddressCreateRequest){

        UserAddress userAdress = new UserAddress();
        userAdress.setAddressLine1(userAddressCreateRequest.getAddressLine1());
        userAdress.setAddressLine2(userAddressCreateRequest.getAddressLine2());
        userAdress.setCountry(userAdress.getCountry());
        userAdress.setCity(userAddressCreateRequest.getCity());
        userAdress.setPostalCode(userAdress.getPostalCode());

        return userAdress;
    }

    public UserAddressResponse userAddressConvertToUsserAddressReponse(UserAddress userAddress){
        if (userAddress == null) {
            return null;
        }

        return new UserAddressResponse(
           userAddress.getId(), 
            userAddress.getAddressLine1(),
            userAddress.getAddressLine2(), 
            userAddress.getPostalCode(), 
            userAddress.getCountry(), 
            userAddress.getCity());
    }
}
