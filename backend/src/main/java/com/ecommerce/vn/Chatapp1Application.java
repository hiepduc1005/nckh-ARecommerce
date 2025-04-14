package com.ecommerce.vn;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
//import java.util.Arrays;
//
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.ecommerce.vn.entity.cart.Cart;
//import com.ecommerce.vn.entity.role.Role;
//import com.ecommerce.vn.entity.user.User;
//import com.ecommerce.vn.service.role.RoleService;
//import com.ecommerce.vn.service.user.UserService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.role.Role;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.role.RoleService;
import com.ecommerce.vn.service.user.UserService;

import jakarta.transaction.Transactional;

@SpringBootApplication
public class Chatapp1Application implements CommandLineRunner {  // ✅ Implement CommandLineRunner để chạy sau khi ứng dụng khởi động

    @Autowired
    private UserService userService;
//
    @Autowired
    private PasswordEncoder passwordEncoder;
//
    @Autowired
    private RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(Chatapp1Application.class, args);
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {  // ✅ Code chạy sau khi Spring Boot khởi động
//        String hashPassword = passwordEncoder.encode("admin");  // Không còn NullPointerException
//        Role roleAdmin = roleService.createLogisticsCoordinatorRole();
//        
//        User user = new User();
//        user.setUserName("carrier");
//        user.setFirstName("carrier");
//        user.setLastName("carrier");
//        user.setPassword(hashPassword);
//        user.setEmail("carrier@gmail.com");
//        user.setCart(new Cart());
//        user.setRoles(Arrays.asList(roleAdmin));
//
//        userService.createUser(user);
//    	
    	
//    	
    	
    }
}
