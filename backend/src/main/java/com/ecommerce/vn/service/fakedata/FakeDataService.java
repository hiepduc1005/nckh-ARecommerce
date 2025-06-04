package com.ecommerce.vn.service.fakedata;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.rating.RatingImage;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAddress;
import com.ecommerce.vn.repository.OrderRepository;
import com.ecommerce.vn.repository.RatingRepository;
import com.ecommerce.vn.repository.UserAddressRepository;
import com.ecommerce.vn.repository.UserRepository;
import com.ecommerce.vn.service.product.ProductService;

import jakarta.transaction.Transactional;

@Service
public class FakeDataService {
    
    @Autowired
    private FakeDataGenerator fakeDataGenerator;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserAddressRepository userAddressRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private RatingRepository ratingRepository;


    @Autowired
    private ProductService productService;

    
    /**
     * Tạo và lưu fake users
     */
    @Transactional
    public List<User> generateAndSaveFakeUsers(int count) {
        List<User> users = fakeDataGenerator.createFakeUsers(count);
        
        // Lưu users
        for (User user : users) {
            User savedUser = userRepository.save(user);
            
            // Lưu addresses
            if (user.getAddresses() != null) {
                for (UserAddress address : user.getAddresses()) {
                    address.setUser(savedUser);
                    userAddressRepository.save(address);
                }
            }
        }
        
        return users;
    }
    
    /**
     * Tạo và lưu fake orders cho existing users
     */
    @Transactional
    public List<Order> generateAndSaveFakeOrders(int maxOrdersPerUser) {
        List<User> existingUsers = userRepository.findAll();
        
        if (existingUsers.isEmpty()) {
            throw new RuntimeException("Không có user nào trong database. Hãy tạo users trước.");
        }
        
        List<Order> allOrders = new java.util.ArrayList<>();
        
        for (User user : existingUsers) {
            int orderCount = 1 + (int)(Math.random() * maxOrdersPerUser);
            List<Order> userOrders = fakeDataGenerator.createFakeOrders(user, orderCount);
            
            for (Order order : userOrders) {
                Order savedOrder = orderRepository.save(order);
                allOrders.add(savedOrder);
            }
        }
        
        return allOrders;
    }
    
    /**
     * Tạo và lưu cả users và orders
     */
    @Transactional
    public Map<String, Object> generateAndSaveCompleteData(int userCount, int maxOrdersPerUser) {
        Map<String, Object> fakeData = fakeDataGenerator.createFakeUsersWithOrders(userCount, maxOrdersPerUser);
        
        @SuppressWarnings("unchecked")
        List<User> users = (List<User>) fakeData.get("users");
        @SuppressWarnings("unchecked")
        List<Order> orders = (List<Order>) fakeData.get("orders");
        
        // Lưu users và addresses
        for (User user : users) {
            User savedUser = userRepository.save(user);
            
            if (user.getAddresses() != null) {
                for (UserAddress address : user.getAddresses()) {
                    address.setUser(savedUser);
                    userAddressRepository.save(address);
                }
            }
            
            // Cập nhật user reference trong orders
            for (Order order : user.getOrders()) {
                order.setUser(savedUser);
            }
        }
        
        // Lưu orders
        for (Order order : orders) {
            orderRepository.save(order);
        }
        
        // Cập nhật kết quả
        fakeData.put("savedUsers", users.size());
        fakeData.put("savedOrders", orders.size());
        
        return fakeData;
    }
    
    /**
     * Xóa tất cả fake data (dành cho testing)
     */
    @Transactional
    public void clearAllData() {
        orderRepository.deleteAll();
        userAddressRepository.deleteAll();
        userRepository.deleteAll();
    }
    
    /**
     * Thống kê dữ liệu hiện tại
     */
    public Map<String, Object> getDataStatistics() {
        long userCount = userRepository.count();
        long orderCount = orderRepository.count();
        long addressCount = userAddressRepository.count();
        
        Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalUsers", userCount);
        stats.put("totalOrders", orderCount);
        stats.put("totalAddresses", addressCount);
        stats.put("averageOrdersPerUser", userCount > 0 ? (double) orderCount / userCount : 0);
        
        return stats;
    }
    
    
    
    @Transactional
    public Map<String, Object> generateAndSaveFakeRatings() {
        System.out.println("Bắt đầu tạo fake ratings cho orders DELIVERED...");
        
        List<Rating> ratings = fakeDataGenerator.createFakeRatingsForDeliveredOrders();
        
        if (ratings.isEmpty()) {
            System.out.println("Không có rating nào được tạo");
            Map<String, Object> result = new HashMap<>();
            result.put("totalRatingsCreated", 0);
            result.put("totalRatingImagesCreated", 0);
            return result;
        }
        
        int totalImages = 0;
        
        // Lưu ratings và rating images
        for (Rating rating : ratings) {
            Rating savedRating = ratingRepository.save(rating);
            
            totalImages += savedRating.getImages().size(); 

        }
        
        System.out.println("Đã tạo và lưu " + ratings.size() + " ratings với " + totalImages + " ảnh");
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalRatingsCreated", ratings.size());
        result.put("totalRatingImagesCreated", totalImages);
        result.put("averageImagesPerRating", ratings.size() > 0 ? (double) totalImages / ratings.size() : 0);
        
        return result;
    }

    /**
     * Tạo và lưu fake ratings cho một user cụ thể
     */
    @Transactional
    public Map<String, Object> generateAndSaveFakeRatingsForUser(UUID userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User không tồn tại: " + userId));
        
        List<Rating> ratings = fakeDataGenerator.createFakeRatingsForUser(user);
        
        int totalImages = 0;
        
        // Lưu ratings và rating images
        for (Rating rating : ratings) {
            Rating savedRating = ratingRepository.save(rating);
            totalImages += savedRating.getImages().size(); 

            
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("userName", user.getUserName());
        result.put("totalRatingsCreated", ratings.size());
        result.put("totalRatingImagesCreated", totalImages);
        
        return result;
    }

    /**
     * Tạo và lưu fake ratings cho một product cụ thể
     */
    @Transactional
    public Map<String, Object> generateAndSaveFakeRatingsForProduct(UUID productId, int maxRatings) {
        Product product = productService.getProductById(productId);
            
  
        List<Rating> ratings = fakeDataGenerator.createFakeRatingsForProduct(product, maxRatings);
        
        int totalImages = 0;
        
        // Lưu ratings và rating images
        for (Rating rating : ratings) {
            Rating savedRating = ratingRepository.save(rating);
            
            totalImages += savedRating.getImages().size(); 
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("productName", product.getProductName());
        result.put("totalRatingsCreated", ratings.size());
        result.put("totalRatingImagesCreated", totalImages);
        result.put("averageRating", ratings.isEmpty() ? 0 : 
            ratings.stream().mapToDouble(Rating::getRatingValue).average().orElse(0));
        
        return result;
    }

    /**
     * Xóa tất cả ratings (dành cho testing)
     */
   


    /**
     * Tạo ratings batch cho nhiều products
     */
    @Transactional
    public Map<String, Object> generateRatingsForAllProducts(int maxRatingsPerProduct) {
        List<Product> allProducts = productService.getAllProducts();
        
        if (allProducts.isEmpty()) {
            throw new RuntimeException("Không có product nào trong database");
        }
        
        List<Rating> allRatings = new ArrayList<>();
        int processedProducts = 0;
        
        for (Product product : allProducts) {
            List<Rating> productRatings = fakeDataGenerator.createFakeRatingsForProduct(product, maxRatingsPerProduct);
            
            // Lưu ratings
            for (Rating rating : productRatings) {
                Rating savedRating = ratingRepository.save(rating);
                
              
                allRatings.add(savedRating);
            }
            
            if (!productRatings.isEmpty()) {
                processedProducts++;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalProducts", allProducts.size());
        result.put("processedProducts", processedProducts);
        result.put("totalRatingsCreated", allRatings.size());
        result.put("averageRatingsPerProduct", processedProducts > 0 ? 
            (double) allRatings.size() / processedProducts : 0);
        
        return result;
    }
}