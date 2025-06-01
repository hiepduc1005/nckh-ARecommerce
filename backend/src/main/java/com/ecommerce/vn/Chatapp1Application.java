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
    	cleanupUnusedFiles();

    }
    
    private void cleanupUnusedFiles() {
        try {
            System.out.println("Starting file cleanup process...");
            
            // Thu thập tất cả đường dẫn file đang được sử dụng
            Set<String> usedFiles = collectUsedFilePaths();
            
            System.out.println("Found " + usedFiles.size() + " files in use");
            
            // Dọn dẹp file images sử dụng FileUploadService
            int deletedImages = cleanupImageFiles(usedFiles);
            System.out.println("Deleted " + deletedImages + " unused image files");
            
            // Dọn dẹp model files sử dụng FileUploadService
            int deletedModels = cleanupModelFiles(usedFiles);
            System.out.println("Deleted " + deletedModels + " unused model files");
            
            System.out.println("File cleanup completed successfully!");
            
        } catch (Exception e) {
            System.err.println("Error during file cleanup: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Thu thập tất cả đường dẫn file đang được sử dụng từ database
     */
    private Set<String> collectUsedFilePaths() {
        Set<String> usedFiles = new HashSet<>();
        
        try {
            // Lấy đường dẫn từ ModelCustomize (sửa lại bug duplicate)
            List<String> customizeImagePaths = customizeRepository.findAll().stream()
                .map(customize -> customize.getImagePath())
                .filter(path -> path != null && !path.trim().isEmpty())
                .collect(Collectors.toList());
            
            List<String> customizeModelPaths = customizeRepository.findAll().stream()
                .map(customize -> customize.getModelPath())
                .filter(path -> path != null && !path.trim().isEmpty())
                .collect(Collectors.toList());
            
            // Lấy đường dẫn từ Product
            List<String> productModelPaths = productService.getAllProducts().stream()
                .map(product -> product.getModelPath())
                .filter(path -> path != null && !path.trim().isEmpty())
                .collect(Collectors.toList());
            
            List<String> productImagePaths = productService.getAllProducts().stream()
                .map(product -> product.getImagePath())
                .filter(path -> path != null && !path.trim().isEmpty())
                .collect(Collectors.toList());
            
            // Thêm tất cả vào Set để tránh duplicate
            usedFiles.addAll(customizeImagePaths);
            usedFiles.addAll(customizeModelPaths);
            usedFiles.addAll(productModelPaths);
            usedFiles.addAll(productImagePaths);
            
            System.out.println("Collected file paths:");
            System.out.println("- Customize images: " + customizeImagePaths.size());
            System.out.println("- Customize models: " + customizeModelPaths.size());
            System.out.println("- Product models: " + productModelPaths.size());
            System.out.println("- Product images: " + productImagePaths.size());
            
        } catch (Exception e) {
            System.err.println("Error collecting used file paths: " + e.getMessage());
        }
        
        return usedFiles;
    }
    
    /**
     * Dọn dẹp file images sử dụng FileUploadService
     */
    private int cleanupImageFiles(Set<String> usedFiles) throws IOException {
        Path dir = Paths.get(uploadDir);
        int deletedCount = 0;
        
        if (!Files.exists(dir)) {
            System.out.println("Directory does not exist: " + uploadDir);
            return 0;
        }
        
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
            for (Path filePath : stream) {
                if (Files.isRegularFile(filePath)) {
                    String fileName = filePath.getFileName().toString();
                    String fullPath = "/uploads/" + fileName;
                    
                    // Kiểm tra xem file có được sử dụng không
                    if (!usedFiles.contains(fullPath)) {
                        try {
                            boolean deleted = fileUploadService.deleteFileFromServer(fullPath);
                            if (deleted) {
                                deletedCount++;
                                System.out.println("Deleted unused image file: " + fullPath);
                            } else {
                                System.out.println("Failed to delete image file: " + fullPath);
                            }
                        } catch (Exception e) {
                            System.err.println("Error deleting image file: " + fullPath + " - " + e.getMessage());
                        }
                    } else {
                        System.out.println("Keeping image file in use: " + fullPath);
                    }
                }
            }
        }
        
        return deletedCount;
    }
    
    /**
     * Dọn dẹp model files sử dụng FileUploadService
     */
    private int cleanupModelFiles(Set<String> usedFiles) throws IOException {
        Path dir = Paths.get(uploadModelDir);
        int deletedCount = 0;
        
        if (!Files.exists(dir)) {
            System.out.println("Directory does not exist: " + uploadModelDir);
            return 0;
        }
        
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir)) {
            for (Path filePath : stream) {
                if (Files.isRegularFile(filePath)) {
                    String fileName = filePath.getFileName().toString();
                    String fullPath = "/uploads/models/" + fileName;
                    
                    // Kiểm tra xem file có được sử dụng không
                    if (!usedFiles.contains(fullPath)) {
                        try {
                            boolean deleted = fileUploadService.deleteModelFromServer(fullPath);
                            if (deleted) {
                                deletedCount++;
                                System.out.println("Deleted unused model file: " + fullPath);
                            } else {
                                System.out.println("Failed to delete model file: " + fullPath);
                            }
                        } catch (Exception e) {
                            System.err.println("Error deleting model file: " + fullPath + " - " + e.getMessage());
                        }
                    } else {
                        System.out.println("Keeping model file in use: " + fullPath);
                    }
                }
            }
        }
        
        return deletedCount;
    }
    
    /**
     * Method để chạy cleanup thủ công (có thể gọi từ controller)
     */
    public void manualCleanup() {
        cleanupUnusedFiles();
    }
}
