package com.ecommerce.vn;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
import com.ecommerce.vn.repository.ModelCustomizeRepository;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.product.ModelCustomizeService;
import com.ecommerce.vn.service.product.ProductService;
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
    
    @Autowired
    private ModelCustomizeRepository customizeRepository;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private FileUploadService fileUploadService;
    private final String uploadDir = "src/main/resources/static/uploads";
    private final String uploadModelDir = "src/main/resources/static/uploads/models";
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
