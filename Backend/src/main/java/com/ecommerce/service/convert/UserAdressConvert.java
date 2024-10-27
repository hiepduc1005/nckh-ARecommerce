package com.ecommerce.service.convert;

import com.ecommerce.dto.user.UserAddressCreateRequest;
import com.ecommerce.dto.user.UserAddressResponse;
import com.ecommerce.entity.user.UserAddress;

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
