package com.ecommerce.vn.controller;

import java.util.UUID;
import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.vn.dto.product.ProductCreateRequest;
import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.dto.product.ProductUpdateRequest;
import com.ecommerce.vn.dto.product.ProductWithScore;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.ProductConvert;
import com.ecommerce.vn.service.product.ProductService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    
    @Autowired
    private ProductConvert productConvert;

    @Autowired
    private ProductService productService;
    
    @Autowired
    private FileUploadService fileUploadService;

    //Tạo sản phẩm
    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateRequest request) {
    	if(request.getImage() == null) {
    		return ResponseEntity.badRequest().body("Product image is empty!");
    	}
        Product product = productConvert.productCreateRequestConver(request);
        String imagePath = fileUploadService.uploadFileToServer(request.getImage());
        product.setImagePath(imagePath);
        
        Product saveProduct = productService.createProduct(product);

        ProductResponse response = productConvert.productConvertToProductResponse(saveProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    //Tìm sản phẩm bằng id
    @PostMapping("/{productId}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("productId") UUID productId){
        Product product = productService.findProductByUuid(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }

        ProductResponse productResponse = productConvert.productConvertToProductResponse(product);
        return ResponseEntity.ok(productResponse);
    }

    //Update sản phẩm
    @PutMapping
    public ResponseEntity<?> updateProduct( @RequestBody ProductUpdateRequest productUpdateRequest) {
    	if(productUpdateRequest.getImage() == null) {
    		return ResponseEntity.badRequest().body("Product image is empty!");
    	}
    	Product productToUpdate = productConvert.productUpdateRequestConver(productUpdateRequest);
    	String imagePath = fileUploadService.uploadFileToServer(productUpdateRequest.getImage());
    	productToUpdate.setImagePath(imagePath);
    	
        Product updateProduct = productService.updateProduct(productToUpdate);
        ProductResponse response = productConvert.productConvertToProductResponse(updateProduct);

        return ResponseEntity.ok(response);
    }

    //Xóa sản phẩm 
    @DeleteMapping
	public ResponseEntity<String> deleteProduct(@PathVariable UUID productId){
		try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok("Product deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Product.");
        }
	}


    // Tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        
        List<ProductResponse> productResponses = products.stream()
        		.map((product) -> 
        			productConvert.productConvertToProductResponse(product)
        			).toList();
        
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    // Lọc sản phẩm theo danh mục, giá, và từ khóa
    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponse>> filterProducts(
            @RequestParam(value = "category", required = false) UUID category,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "keyword", required = false) String keyword) {
        List<Product> products = productService.filterProducts(category, minPrice, maxPrice, keyword);
        
        List<ProductResponse> productResponses = products.stream()
        		.map((product) -> 
        			productConvert.productConvertToProductResponse(product)
        			).toList();
        
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    // Phân trang và sắp xếp sản phẩm
    @GetMapping("/pagination")
    public ResponseEntity<Page<Product>> getProductsWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam("sortBy") String sortBy) {
        Page<Product> products = productService.getProductsWithPaginationAndSorting(page, size, sortBy);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Lấy danh sách sản phẩm theo người bán 
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ProductResponse>> getProductBySeller(@PathVariable("sellerId") UUID sellerId) {
        List<Product> products = productService.getProductBySeller(sellerId);
        
        List<ProductResponse> productResponses = products.stream()
        		.map((product) -> 
        			productConvert.productConvertToProductResponse(product)
        			).toList();
        
        
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }

    // Lấy tất cả sản phẩm chưa được kích hoạt
    @GetMapping("/unactive")
    public ResponseEntity<List<ProductResponse>> getAllProductUnactive() {
        List<Product> products = productService.getAllProductUnactive();

        List<ProductResponse> productResponses = products.stream()
        		.map((product) -> 
        			productConvert.productConvertToProductResponse(product)
        			).toList();

        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }
    
    @GetMapping("/{productId}/related")
    public ResponseEntity<List<ProductWithScore>> getProductsRelated(@PathVariable("productId") UUID productId) {
        List<ProductWithScore> products = productService.getRelatedProducts(productId);

        return new ResponseEntity<>(products, HttpStatus.OK);
    }


    // Kích hoạt sản phẩm theo productId
    @PutMapping("/{id}/activate")
    public ResponseEntity<ProductResponse> activateProduct(@PathVariable("id") UUID productId) {
        Product activatedProduct = productService.activateProduct(productId);
       
        ProductResponse productResponse = productConvert.productConvertToProductResponse(activatedProduct);
        
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    // Vô hiệu hóa sản phẩm theo productId
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ProductResponse> deactivateProduct(@PathVariable("id") UUID productId) {
        Product deactivatedProduct = productService.deactiveProduct(productId);
    
        ProductResponse productResponse = productConvert.productConvertToProductResponse(deactivatedProduct);

        
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }


    //Sản phẩm liên quan
    //Sản phẩm yêu thích
}
