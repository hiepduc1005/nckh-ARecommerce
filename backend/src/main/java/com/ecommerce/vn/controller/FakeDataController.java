package com.ecommerce.vn.controller;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.service.fakedata.FakeDataService;

@RestController
@RequestMapping("/api/fake-data")
public class FakeDataController {
    
    @Autowired
    private FakeDataService fakeDataService;
    
    
    /**
     * Tạo fake users
     * GET /api/fake-data/users?count=50
     */
    @GetMapping("/users")
    public ResponseEntity<?> generateFakeUsers(@RequestParam(defaultValue = "10") int count) {
        try {
            if (count > 3000) {
                return ResponseEntity.badRequest().body("Số lượng user không được vượt quá 1000");
            }
            
            var users = fakeDataService.generateAndSaveFakeUsers(count);
            
            Map<String, Object> response = Map.of(
                "message", "Tạo thành công " + users.size() + " fake users",
                "count", users.size(),
                "data", users.stream().limit(5).toList() // Chỉ trả về 5 user đầu tiên để xem mẫu
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    @GetMapping("/ratings")
    public ResponseEntity<?> generateFakeRatings() {
        try {
            
            
            var ratings = fakeDataService.generateAndSaveFakeRatings();
            
            
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    /**
     * Tạo fake orders cho existing users
     * GET /api/fake-data/orders?maxPerUser=5
     */
    @GetMapping("/orders")
    public ResponseEntity<?> generateFakeOrders(@RequestParam(defaultValue = "3") int maxPerUser) {
        try {
            if (maxPerUser > 20) {
                return ResponseEntity.badRequest().body("Số lượng order per user không được vượt quá 20");
            }
            
            var orders = fakeDataService.generateAndSaveFakeOrders(maxPerUser);
            
            Map<String, Object> response = Map.of(
                "message", "Tạo thành công " + orders.size() + " fake orders",
                "count", orders.size(),
                "maxOrdersPerUser", maxPerUser,
                "data", orders.stream().limit(5).toList() // Chỉ trả về 5 order đầu tiên
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    /**
     * Tạo cả users và orders
     * GET /api/fake-data/complete?userCount=20&maxOrdersPerUser=5
     */
    @GetMapping("/complete")
    public ResponseEntity<?> generateCompleteData(
            @RequestParam(defaultValue = "10") int userCount,
            @RequestParam(defaultValue = "3") int maxOrdersPerUser) {
        try {
            if (userCount > 500) {
                return ResponseEntity.badRequest().body("Số lượng user không được vượt quá 500");
            }
            if (maxOrdersPerUser > 10) {
                return ResponseEntity.badRequest().body("Số lượng order per user không được vượt quá 10");
            }
            
            Map<String, Object> result = fakeDataService.generateAndSaveCompleteData(userCount, maxOrdersPerUser);
            
            Map<String, Object> response = Map.of(
                "message", "Tạo thành công dữ liệu fake",
                "totalUsers", result.get("totalUsers"),
                "totalOrders", result.get("totalOrders"),
                "savedUsers", result.get("savedUsers"),
                "savedOrders", result.get("savedOrders")
            );
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    /**
     * Xem thống kê dữ liệu hiện tại
     * GET /api/fake-data/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDataStatistics() {
        try {
            Map<String, Object> stats = fakeDataService.getDataStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    /**
     * Xóa tất cả dữ liệu fake (cẩn thận!)
     * DELETE /api/fake-data/clear
     */
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAllData(@RequestParam(required = true) String confirm) {
        if (!"YES_DELETE_ALL".equals(confirm)) {
            return ResponseEntity.badRequest().body("Để xóa tất cả dữ liệu, hãy thêm parameter ?confirm=YES_DELETE_ALL");
        }
        
        try {
            fakeDataService.clearAllData();
            return ResponseEntity.ok(Map.of("message", "Đã xóa tất cả fake data"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}