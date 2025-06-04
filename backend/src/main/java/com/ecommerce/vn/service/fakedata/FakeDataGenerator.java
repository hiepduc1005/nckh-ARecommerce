package com.ecommerce.vn.service.fakedata;

import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.entity.user.UserAddress;
import com.ecommerce.vn.repository.OrderRepository;
import com.ecommerce.vn.repository.RatingRepository;
import com.ecommerce.vn.service.order.OrderService;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.role.RoleService;
import com.ecommerce.vn.service.variant.VariantService;
import com.ecommerce.vn.entity.cart.Cart;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.entity.order.OrderItem;
import com.ecommerce.vn.entity.order.OrderStatus;
import com.ecommerce.vn.entity.order.PaymentMethod;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Variant;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.entity.rating.RatingImage;
import com.ecommerce.vn.entity.role.Role;
import com.github.javafaker.Faker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class FakeDataGenerator {
    
    private final Faker faker = new Faker(new Locale("vi"));
	
    private final Random random = new Random();

	@Autowired
	private final VariantService variantService;
	
	@Autowired
	private OrderService orderService;
	
	@Autowired
	private ProductService productService;
	
	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired
	private RatingRepository ratingRepository;
	
	
    
	@Autowired
	private RoleService roleService;
    // Constructor injection
    public FakeDataGenerator(VariantService variantService) {
        this.variantService = variantService;
    }
    
    // Danh sách tên Việt Nam
    private final String[] vietnameseFirstNames = {
        "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", 
        "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý", "Đinh", "Mai", "Lâm", "Đào"
    };
    
    private final String[] vietnameseLastNames = {
        "Văn Hùng", "Thị Lan", "Văn Nam", "Thị Hoa", "Văn Dũng", "Thị Mai", "Văn Tùng", 
        "Thị Linh", "Văn Đức", "Thị Nga", "Văn Minh", "Thị Thu", "Văn Hải", "Thị Hương",
        "Văn Long", "Thị Phương", "Văn Quang", "Thị Trang", "Văn Tuấn", "Thị Nhung"
    };
    
    private final String[] vietnameseCities = {
        "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Hải Dương", 
        "Nam Định", "Thái Bình", "Ninh Bình", "Thanh Hóa", "Nghệ An", "Hà Tĩnh",
        "Quảng Bình", "Quảng Trị", "Thừa Thiên Huế", "Quảng Nam", "Quảng Ngãi",
        "Bình Định", "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận"
    };
    
    private final String[] vietnameseDistricts = {
        "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7",
        "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Quận Bình Thạnh",
        "Quận Tân Bình", "Quận Phú Nhuận", "Quận Gò Vấp", "Quận Thủ Đức",
        "Huyện Bình Chánh", "Huyện Hóc Môn", "Huyện Củ Chi", "Huyện Nhà Bè"
    };
    
    /**
     * Tạo fake user
     */
    public User createFakeUser() {
        User user = new User();
        
        // Thông tin cơ bản
        user.setId(UUID.randomUUID());
        user.setFirstName(vietnameseFirstNames[random.nextInt(vietnameseFirstNames.length)]);
        user.setLastName(vietnameseLastNames[random.nextInt(vietnameseLastNames.length)]);
        
        // Tạo username và email từ tên
        String username = removeVietnameseAccents(user.getFirstName().toLowerCase()) + 
                         removeVietnameseAccents(user.getLastName().toLowerCase()).replace(" ", "") + 
                         random.nextInt(1000);
        user.setUserName(username);
        user.setEmail(username + "@gmail.com");
        
        // Thông tin khác
        user.setPhoneNumber("0" + (random.nextInt(9) + 1) + String.format("%08d", random.nextInt(100000000)));
        user.setGender(random.nextBoolean() ? "Nam" : "Nữ");
        user.setDateOfBirth(LocalDate.now().minusYears(18 + random.nextInt(50)));
        user.setPassword("$2a$10$" + faker.internet().password()); // Mô phỏng password đã hash
        user.setLoyaltyPoint(random.nextInt(10000));
        user.setActive(random.nextInt(100) > 1); // 90% active
        
        // Thời gian
        LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(365));
        user.setCreatedAt(createdAt);
        user.setUpdateAt(createdAt.plusDays(random.nextInt(30)));
        
        // Thêm địa chỉ
        user.setAddresses(createFakeAddresses(user, 1 + random.nextInt(3)));
        

        Role userRole = roleService.getRoleByName("USER");
        user.setRoles(Arrays.asList(userRole));
        return user;
    }
    
    /**
     * Tạo fake addresses cho user
     */
    public List<UserAddress> createFakeAddresses(User user, int count) {
        List<UserAddress> addresses = new ArrayList<>();
        
        for (int i = 0; i < count; i++) {
            UserAddress address = new UserAddress();
            address.setId(UUID.randomUUID());
            address.setUser(user);
            address.setName(user.getFirstName() + " " + user.getLastName());
            address.setPhone(user.getPhoneNumber());
            
            String city = vietnameseCities[random.nextInt(vietnameseCities.length)];
            String district = vietnameseDistricts[random.nextInt(vietnameseDistricts.length)];
            address.setAddress(city + ", " + district);
            address.setSpecificAddress((random.nextInt(500) + 1) + " " + faker.address().streetName());
            address.setDefault(i == 0); // Địa chỉ đầu tiên là mặc định
            
            addresses.add(address);
        }
        
        return addresses;
    }
    

    
    /**
     * Tạo fake order items cho order
     */
    public List<OrderItem> createFakeOrderItems(Order order) {
        List<OrderItem> orderItems = new ArrayList<>();
        
        // Lấy tất cả variants có sẵn từ database
        List<Variant> availableVariants = variantService.findAll();
        
        if (availableVariants == null || availableVariants.isEmpty()) {
            throw new RuntimeException("Không có variant nào trong database để tạo order items");
        }
        
        // Tạo 1-5 order items cho mỗi order
        int itemCount = 1 + random.nextInt(5);
        
        for (int i = 0; i < itemCount; i++) {
            OrderItem orderItem = new OrderItem();
            orderItem.setId(UUID.randomUUID());
            orderItem.setOrder(order);
            
            // Chọn variant ngẫu nhiên từ danh sách có sẵn
            Variant variant = availableVariants.get(random.nextInt(availableVariants.size()));
            orderItem.setVariant(variant);
            
            // Số lượng sản phẩm (1-10) nhưng không vượt quá tồn kho
            int maxQuantity = Math.min(4, variant.getQuantity());
            orderItem.setQuantity(1 + random.nextInt(Math.max(1, maxQuantity)));
            
            // Chỉ tạo variant item (không custom)
            orderItem.setIsCustomized(false);
            orderItem.setModelDesign(null);
            
            orderItems.add(orderItem);
        }
        
        return orderItems;
    }
    
    /**
     * Tính tổng giá tiền dựa trên order items
     */
    public BigDecimal calculateOrderTotal(List<OrderItem> orderItems) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (OrderItem item : orderItems) {
            Variant variant = item.getVariant();
            
            // Sử dụng phương thức từ service để tính giá sau giảm giá
            BigDecimal itemPrice = (variant.getDiscountPrice() != null 
                    && variant.getDiscountPrice().compareTo(BigDecimal.ZERO) > 0)
                    ? variant.getDiscountPrice() 
                    : variant.getPrice();            
            // Tổng tiền = giá sau giảm giá * số lượng
            BigDecimal itemTotal = itemPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);
        }
        
        return total;
    }
    
    /**
     * Tạo fake order với order items
     */
    public Order createFakeOrder(User user) {
        Order order = new Order();
        
        order.setId(UUID.randomUUID());
        order.setUser(user);
        order.setEmail(user.getEmail());
        order.setPhone(user.getPhoneNumber());
        
        // Lấy địa chỉ ngẫu nhiên của user
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            UserAddress userAddress = user.getAddresses().get(random.nextInt(user.getAddresses().size()));
            order.setAddress(userAddress.getAddress());
            order.setSpecificAddress(userAddress.getSpecificAddress());
        } else {
            order.setAddress(vietnameseCities[random.nextInt(vietnameseCities.length)]);
            order.setSpecificAddress((random.nextInt(500) + 1) + " " + faker.address().streetName());
        }
        
        // Tạo mã đơn hàng
        order.setCode("ORD" + System.currentTimeMillis() + random.nextInt(1000));
        
        // Trạng thái đơn hàng
        OrderStatus[] statuses = {OrderStatus.SHIPPED, OrderStatus.CANCELLED,OrderStatus.DELIVERED,OrderStatus.PROCESSING,OrderStatus.REFUNDED,OrderStatus.PAID,OrderStatus.PENDING};
        order.setOrderStatus(statuses[random.nextInt(statuses.length)]);
        
        // Phương thức thanh toán
        PaymentMethod[] paymentMethods = PaymentMethod.values();
        order.setPaymentMethod(paymentMethods[random.nextInt(paymentMethods.length)]);
        
        // Thông tin vận chuyển
        String[] shippingMethods = {"Standard", "Express", "Super Fast"};
        order.setShippingMethod(shippingMethods[random.nextInt(shippingMethods.length)]);
        order.setShippingFee(BigDecimal.valueOf(15000 + random.nextInt(50000))); // 15k - 65k
        
        // Tạo order items trước
        List<OrderItem> orderItems = createFakeOrderItems(order);
        order.setOrderItems(orderItems);
        
        // Tính tổng tiền dựa trên các sản phẩm
        BigDecimal itemsTotal = calculateOrderTotal(orderItems);
        order.setTotalPrice(itemsTotal.add(order.getShippingFee()));
        
        // Giảm giá đơn hàng (0-10% tổng tiền items)
        BigDecimal maxDiscount = itemsTotal.multiply(BigDecimal.valueOf(0.1));
        order.setDiscountPrice(BigDecimal.valueOf(random.nextInt(maxDiscount.intValue() + 1)));
        
        // Ghi chú
        if (random.nextBoolean()) {
            String[] notes = {
                "Giao hàng giờ hành chính",
                "Gọi trước khi giao",
                "Để ở bảo vệ nếu không có người",
                "Giao hàng cuối tuần",
                "Kiểm tra hàng trước khi thanh toán",
                "Liên hệ trước qua Zalo",
                "Không giao vào giờ nghỉ trưa",
                "Giao đúng địa chỉ, không gọi lại",
                "Giao nhanh trong ngày nếu được",
                "Giao hàng sau 18h"
            };
            order.setNotes(notes[random.nextInt(notes.length)]);
        }
        
        // Thời gian
        LocalDateTime createdAt = LocalDateTime.now().minusDays(random.nextInt(360));
        order.setCreatedAt(createdAt);
        order.setExpiresAt(createdAt.plusMinutes(15)); // Hết hạn sau 15 phút
        
        if (order.getOrderStatus() != OrderStatus.PENDING && order.getOrderStatus() != OrderStatus.CANCELLED) {
            order.setOrderApprovedAt(createdAt.plusMinutes(5 + random.nextInt(30)));
        }
        
        if(order.getOrderStatus().equals(OrderStatus.DELIVERED)) {
        	productService.updateSoldQuantity(order);
        }
        
        // URL thanh toán (nếu chưa thanh toán)
        if (order.getOrderStatus() == OrderStatus.PENDING) {
            order.setPaymentUrl("https://payment.gateway.com/pay/" + order.getId());
        }
        
        return order;
    }
    
    /**
     * Tạo nhiều fake users
     */
    public List<User> createFakeUsers(int count) {
        List<User> users = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            users.add(createFakeUser());
        }
        return users;
    }
    
    /**
     * Tạo nhiều fake orders cho một user
     */
    public List<Order> createFakeOrders(User user, int count) {
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            orders.add(createFakeOrder(user));
        }
        return orders;
    }
    
    /**
     * Tạo fake users và orders
     */
    public Map<String, Object> createFakeUsersWithOrders(int userCount, int maxOrdersPerUser) {
        List<User> users = new ArrayList<>();
        List<Order> allOrders = new ArrayList<>();
        List<OrderItem> allOrderItems = new ArrayList<>();
        
        for (int i = 0; i < userCount; i++) {
            User user = createFakeUser();
            users.add(user);
            
            // Tạo 1-maxOrdersPerUser đơn hàng cho mỗi user
            int orderCount = 1 + random.nextInt(maxOrdersPerUser);
            List<Order> userOrders = createFakeOrders(user, orderCount);
            allOrders.addAll(userOrders);
            
            // Collect all order items
            for (Order order : userOrders) {
                allOrderItems.addAll(order.getOrderItems());
            }
            
            // Set orders cho user
            user.setOrders(userOrders);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("orders", allOrders);
        result.put("orderItems", allOrderItems);
        result.put("totalUsers", users.size());
        result.put("totalOrders", allOrders.size());
        result.put("totalOrderItems", allOrderItems.size());
        
        return result;
    }
    
    /**
     * Loại bỏ dấu tiếng Việt
     */
    private String removeVietnameseAccents(String str) {
        String[] vietnameseChars = {"à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ",
                "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ",
                "ì", "í", "ị", "ỉ", "ĩ",
                "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ",
                "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ",
                "ỳ", "ý", "ỵ", "ỷ", "ỹ",
                "đ"};
        String[] replacements = {"a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
                "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e",
                "i", "i", "i", "i", "i",
                "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o", "o",
                "u", "u", "u", "u", "u", "u", "u", "u", "u", "u", "u",
                "y", "y", "y", "y", "y",
                "d"};
        
        for (int i = 0; i < vietnameseChars.length; i++) {
            str = str.replace(vietnameseChars[i], replacements[i]);
            str = str.replace(vietnameseChars[i].toUpperCase(), replacements[i].toUpperCase());
        }
        return str;
    }
    
    private boolean hasUserReviewedProduct(User user, Product product) {
        return ratingRepository.existsByUserIdAndProductId(user.getId(), product.getId());
    }
    
    /**
     * Tạo fake rating với kiểm tra duplicate review
     */
    public Rating createFakeRating(OrderItem orderItem, User user) {
        Product product = orderItem.getVariant().getProduct();
        
        // Kiểm tra xem user đã review product này chưa
        if (hasUserReviewedProduct(user, product)) {
            return null; // Bỏ qua nếu đã review
        }
        
        Rating rating = new Rating();
        
        rating.setId(UUID.randomUUID());
        rating.setProduct(product);
        rating.setUser(user);
        
        // Rating value từ 3-5 (thiên về tích cực)
        double rand = random.nextDouble();
        int ratingOffset;
        if (rand < 0.1) {        // 20% cho 0
            ratingOffset = 0;
        } else if (rand < 0.45) { // 4% cho 1  
            ratingOffset = 1;
        } else {                  // 4% cho 2
            ratingOffset = 2;
        }
        int ratingValue = 3 + ratingOffset; // Kết quả: 3, 4, 5
        rating.setRatingValue(Math.round(ratingValue * 10.0) / 10.0); // Làm tròn 1 chữ số thập phân
        
       
        rating.setComment(generateRandomComment(rating.getRatingValue()));
        
        // Verified rating (80% được verify)
        rating.setIsVerified(true);
        
        // Thời gian tạo rating sau khi order được delivered (1-30 ngày)
        Order order = orderItem.getOrder();
        LocalDateTime deliveredDate = order.getOrderApprovedAt() != null 
            ? order.getOrderApprovedAt().plusDays(1 + random.nextInt(3)) // Giả sử giao hàng sau 1-3 ngày approve
            : order.getCreatedAt().plusDays(3); // Fallback
        
        LocalDateTime ratingDate = deliveredDate.plusDays(1 + random.nextInt(30));
        rating.setCreatedAt(ratingDate);
        rating.setUpdatedAt(ratingDate);
        
        // Tạo rating images từ variants của product
        List<RatingImage> images = createFakeRatingImages(rating, product);
        rating.setImages(images);
        
        return rating;
    }

    /**
     * Tạo fake rating images từ variants của product (cải thiện)
     */
    public List<RatingImage> createFakeRatingImages(Rating rating, Product product) {
        List<RatingImage> images = new ArrayList<>();
        
        // Lấy tất cả variants của product có imagePath không null
        List<Variant> productVariants = product.getVariants().stream()
            .filter(variant -> variant.getImagePath() != null && !variant.getImagePath().trim().isEmpty())
            .collect(Collectors.toList());
        
        if (productVariants.isEmpty()) {
            return images; // Không có variant có ảnh
        }
        
        // 60% rating có ảnh, 40% không có ảnh
        if (random.nextInt(100) > 60) {
            return images;
        }
        
        // Số lượng ảnh ngẫu nhiên (1-5 ảnh, nhưng không quá số variants có ảnh)
        int maxImages = Math.min(4, productVariants.size());
        int imageCount = 1 + random.nextInt(maxImages);
        
        // Shuffle danh sách variants để chọn ngẫu nhiên
        Collections.shuffle(productVariants);
        
        // Tạo rating images từ các variants được chọn
        for (int i = 0; i < imageCount; i++) {
            Variant selectedVariant = productVariants.get(i);
            
            RatingImage ratingImage = new RatingImage();
            ratingImage.setId(UUID.randomUUID());
            ratingImage.setRating(rating);
            ratingImage.setImageUrl(selectedVariant.getImagePath());
            images.add(ratingImage);
        }
        
        return images;
    }

    /**
     * Tạo comment ngẫu nhiên dựa trên rating value
     */
    private String generateRandomComment(Double ratingValue) {
        String[] positiveComments = {
            "Sản phẩm rất tốt, đúng như mô tả!",
            "Chất lượng tuyệt vời, giao hàng nhanh",
            "Mình rất hài lòng với sản phẩm này",
            "Đóng gói cẩn thận, sản phẩm đẹp",
            "Giá cả hợp lý, chất lượng ok",
            "Shop phục vụ tốt, sẽ ủng hộ tiếp",
            "Sản phẩm đúng size, màu sắc đẹp",
            "Giao hàng đúng hẹn, đóng gói kỹ",
            "Chất lượng vượt mong đợi",
            "Rất đáng tiền, recommend cho mọi người"
        };
        
        String[] neutralComments = {
            "Sản phẩm bình thường, tạm ổn",
            "Đúng như mô tả, không có gì đặc biệt",
            "Chất lượng tạm được với giá này",
            "Giao hàng hơi chậm nhưng sản phẩm ok",
            "Sản phẩm ổn, packaging có thể tốt hơn",
            "Đã nhận hàng, chất lượng bình thường",
            "Không quá tệ nhưng cũng không xuất sắc",
            "Giá hợp lý, chất lượng tương xứng"
        };
        
        String[] negativeComments = {
            "Sản phẩm không như mong đợi",
            "Chất lượng hơi kém so với giá",
            "Giao hàng chậm, đóng gói không cẩn thận",
            "Màu sắc khác với hình ảnh",
            "Size không đúng như mô tả",
            "Sản phẩm có một số khuyết điểm nhỏ",
            "Chất liệu không như quảng cáo",
            "Cần cải thiện chất lượng hơn"
        };
        
        if (ratingValue >= 4.0) {
            return positiveComments[random.nextInt(positiveComments.length)];
        } else if (ratingValue >= 3.0) {
            return neutralComments[random.nextInt(neutralComments.length)];
        } else {
            return negativeComments[random.nextInt(negativeComments.length)];
        }
    }

    /**
     * Tạo fake ratings cho tất cả orders có status DELIVERED (cải thiện)
     */
    public List<Rating> createFakeRatingsForDeliveredOrders() {
        List<Rating> ratings = new ArrayList<>();
        
        // Lấy tất cả orders có status DELIVERED từ database
        List<Order> deliveredOrders = orderRepository.findByOrderStatus(OrderStatus.DELIVERED);
        
        if (deliveredOrders.isEmpty()) {
            System.out.println("Không có order nào với status DELIVERED để tạo rating");
            return ratings;
        }
        
        System.out.println("Tìm thấy " + deliveredOrders.size() + " orders DELIVERED");
        
        int totalOrderItems = 0;
        int ratingsCreated = 0;
        int skippedDueToExistingReviews = 0;
        
        for (Order order : deliveredOrders) {
            // 80% orders sẽ có rating (không phải tất cả đều rate)
            if (random.nextInt(100) < 3) { // 20% bỏ qua
                continue;
            }
            
            // Tạo rating cho từng order item trong order
            for (OrderItem orderItem : order.getOrderItems()) {
                totalOrderItems++;
                
               
                
                Rating rating = createFakeRating(orderItem, order.getUser());
                if (rating != null) {
                    ratings.add(rating);
                    ratingsCreated++;
                } else {
                    skippedDueToExistingReviews++;
                }
            }
        }
        
        System.out.println("Tổng số order items: " + totalOrderItems);
        System.out.println("Ratings được tạo: " + ratingsCreated);
        System.out.println("Bỏ qua do đã review: " + skippedDueToExistingReviews);
        
        return ratings;
    }

    /**
     * Tạo fake ratings cho một user cụ thể (chỉ orders DELIVERED) - cải thiện
     */
    public List<Rating> createFakeRatingsForUser(User user) {
        List<Rating> ratings = new ArrayList<>();
        
        if (user.getOrders() == null || user.getOrders().isEmpty()) {
            return ratings;
        }
        
        int ratingsCreated = 0;
        int skippedDueToExistingReviews = 0;
        
        for (Order order : user.getOrders()) {
            // Chỉ tạo rating cho orders DELIVERED
            if (!OrderStatus.DELIVERED.equals(order.getOrderStatus())) {
                continue;
            }
            
            // 85% orders DELIVERED sẽ có rating
            if (random.nextInt(100) < 15) {
                continue;
            }
            
            for (OrderItem orderItem : order.getOrderItems()) {
                // 90% order items sẽ có rating
                if (random.nextInt(100) < 10) {
                    continue;
                }
                
                Rating rating = createFakeRating(orderItem, user);
                if (rating != null) {
                    ratings.add(rating);
                    ratingsCreated++;
                } else {
                    skippedDueToExistingReviews++;
                }
            }
        }
        
        System.out.println("User " + user.getUserName() + " - Ratings tạo: " + ratingsCreated + 
                          ", Bỏ qua do đã review: " + skippedDueToExistingReviews);
        
        return ratings;
    }

    /**
     * Tạo fake ratings cho một product cụ thể - cải thiện
     */
    public List<Rating> createFakeRatingsForProduct(Product product, int maxRatings) {
        List<Rating> ratings = new ArrayList<>();
        
        // Lấy tất cả order items DELIVERED cho product này
        List<OrderItem> deliveredOrderItems = new ArrayList<>();
        List<Order> deliveredOrders = orderRepository.findByOrderStatus(OrderStatus.DELIVERED);
        
        for (Order order : deliveredOrders) {
            for (OrderItem item : order.getOrderItems()) {
                if (item.getVariant() != null && 
                    item.getVariant().getProduct() != null && 
                    item.getVariant().getProduct().getId().equals(product.getId())) {
                    deliveredOrderItems.add(item);
                }
            }
        }
        
        if (deliveredOrderItems.isEmpty()) {
            System.out.println("Không có order item DELIVERED nào cho product: " + product.getProductName());
            return ratings;
        }
        
        // Shuffle để random
        Collections.shuffle(deliveredOrderItems);
        
        int ratingsCreated = 0;
        int skippedDueToExistingReviews = 0;
        
        // Tạo ratings, không quá maxRatings
        for (OrderItem orderItem : deliveredOrderItems) {
            if (ratingsCreated >= maxRatings) {
                break;
            }
            
            Rating rating = createFakeRating(orderItem, orderItem.getOrder().getUser());
            if (rating != null) {
                ratings.add(rating);
                ratingsCreated++;
            } else {
                skippedDueToExistingReviews++;
            }
        }
        
        System.out.println("Product " + product.getProductName() + " - Ratings tạo: " + ratingsCreated + 
                          ", Bỏ qua do đã review: " + skippedDueToExistingReviews);
        
        return ratings;
    }
    
}