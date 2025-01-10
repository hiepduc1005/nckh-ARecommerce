package com.ecommerce.vn.service.convert;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.user.UserAddressResponse;
import com.ecommerce.vn.dto.user.UserCreateRequest;
import com.ecommerce.vn.dto.user.UserResponse;
import com.ecommerce.vn.dto.user.UserUpdateRequest;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.user.UserService;

@Service 
public class UserConvert {
    @Autowired
    private UserAdressConvert userAdressConvert;
    
    @Autowired
    private UserService userService;

    @SuppressWarnings("null")
    public User userCreateRequestConvert(UserCreateRequest userCreateRequest){
        if(userCreateRequest == null){
            return null;
        }

        User user = new User();
        user.setFirstName(userCreateRequest.getFirstname());
        user.setFirstName(userCreateRequest.getLastname());
        user.setEmail(userCreateRequest.getEmail());
        user.setPassword(userCreateRequest.getPassword());  

        return user;
    }
    
    public User userUpdateRequestConvert(UserUpdateRequest userUpdateRequest){
        if(userUpdateRequest == null){
            return null;
        }

        User user = userService.findUserByUuId((userUpdateRequest.getId()));
        user.setFirstName(userUpdateRequest.getFirstname());
        user.setFirstName(userUpdateRequest.getLastname());
        user.setEmail(userUpdateRequest.getEmail());
        user.setUserName(userUpdateRequest.getUsername());
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
        user.getUserName(),
        user.getEmail(),
        user.getPhoneNumber(),
        user.getActive(),
        user.getLoyaltyPoint(),
        addressResponses,
        user.getCreatedAt(),
        user.getDeletedAt()
        );

    }
}
