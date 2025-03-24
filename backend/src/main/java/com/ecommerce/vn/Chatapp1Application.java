package com.ecommerce.vn;

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

import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.user.UserService;

@SpringBootApplication
public class Chatapp1Application implements CommandLineRunner {  // ✅ Implement CommandLineRunner để chạy sau khi ứng dụng khởi động

    @Autowired
    private UserService userService;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Autowired
//    private RoleService roleService;

    public static void main(String[] args) {
        SpringApplication.run(Chatapp1Application.class, args);
    }

    @Override
//    @Transactional
    public void run(String... args) throws Exception {  // ✅ Code chạy sau khi Spring Boot khởi động
//        String hashPassword = passwordEncoder.encode("admin");  // Không còn NullPointerException
//        Role roleAdmin = roleService.getRoleByName("ADMIN");
//        
//        User user = new User();
//        user.setUserName("Admin");
//        user.setFirstName("Admin");
//        user.setLastName("Admin");
//        user.setPassword(hashPassword);
//        user.setEmail("admin@gmail.com");
//        user.setCart(new Cart());
//        user.setRoles(Arrays.asList(roleAdmin));
//
//        userService.createUser(user);
    	
    	
//    	
    	
    }
}
