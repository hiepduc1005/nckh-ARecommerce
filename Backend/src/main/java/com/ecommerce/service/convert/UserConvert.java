package com.ecommerce.service.convert;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.dto.user.UserAddressResponse;
import com.ecommerce.dto.user.UserCreateRequest;
import com.ecommerce.dto.user.UserResponse;
import com.ecommerce.entity.user.User;

@Service 
public class UserConvert {
    @Autowired
    private UserAdressConvert userAdressConvert;

    @SuppressWarnings("null")
    public User userCreateRequestConvert(UserCreateRequest userCreateRequest){
        if(userCreateRequest != null){
            return null;
        }

        User user = new User();
        user.setFirstName(userCreateRequest.getFirstname());
        user.setFirstName(userCreateRequest.getLastname());
        user.setEmail(userCreateRequest.getEmail());
        user.setPassword(userCreateRequest.getPassword());  

        return user;
    }


    public UserResponse userConvertToUserResponse(User user){
        if (user == null){
            return null;
        }

        Set<UserAddressResponse> addressResponses = user.getAddresses().stream()
            .map(userAdressConvert::userAddressConvertToUsserAddressReponse) 
            .collect(Collectors.toSet());

            
        return new UserResponse(
        user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getEmail(),
        user.getPhoneNumber(),
        addressResponses,
        user.getCreatedAt(),
        user.getDeletedAt()
        );

    }
}
