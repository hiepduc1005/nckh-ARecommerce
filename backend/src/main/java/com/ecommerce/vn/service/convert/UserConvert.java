package com.ecommerce.vn.service.convert;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.role.RoleResponse;
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
    private RoleConvert roleConvert;
    
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
        
        String dateBirthStr = userUpdateRequest.getDateOfBirth();
        System.out.println(dateBirthStr);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate dateBirth = LocalDate.parse(dateBirthStr, formatter);

        User user = userService.findUserByUuId((userUpdateRequest.getId()));
        user.setFirstName(userUpdateRequest.getFirstname());
        user.setLastName(userUpdateRequest.getLastname());
        user.setEmail(userUpdateRequest.getEmail());
        user.setUserName(userUpdateRequest.getUsername());
        user.setGender(userUpdateRequest.getGender());
        user.setPhoneNumber(userUpdateRequest.getPhone());
        user.setDateOfBirth(dateBirth);
        
        return user;
    }


    public UserResponse userConvertToUserResponse(User user){
        if (user == null){
            return null;
        }

        Set<UserAddressResponse> addressResponses = user.getAddresses().stream()
            .map(userAdressConvert::userAddressConvertToUsserAddressReponse) 
            .collect(Collectors.toSet());
        
        List<RoleResponse> roleResponses = user.getRoles()
        		.stream()
        		.map((role) -> roleConvert.roleConvertToRoleResponse(role))
        		.toList();
        

        UserResponse userResponse = new UserResponse(
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
        
        if(user.getDateOfBirth() != null) {
        	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");        
        	String birthDate = user.getDateOfBirth().format(formatter);
        	userResponse.setDateOfBirth(birthDate);        	
        }
        
        userResponse.setGender(user.getGender());
        userResponse.setRoles(roleResponses);
            
        return userResponse;

    }
}
