package com.ecommerce.controller;

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

import com.ecommerce.dto.product.ProductCreateRequest;
import com.ecommerce.dto.product.ProductResponse;
import com.ecommerce.entity.product.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.service.product.ProductService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

import com.ecommerce.service.convert.ProductConvert;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductConvert productConvert;

    @Autowired
    private ProductService productService;

    //Tạo sản phẩm
    @PostMapping("/Products")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreateRequest request) {
        Product product = productConvert.productCreateRequestConver(request);

        Product saveProduct = productService.createProduct(product);

        ProductResponse response = productConvert.productConvertToProductResponse(saveProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //Tìm sản phẩm bằng id
    @PostMapping("/{productId}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("productId") UUID productId) {
        Product product = productService.findProductByUuid(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        ProductResponse productResponse = productConvert.productConvertToProductResponse(product);
        return ResponseEntity.ok(productResponse);
    }

    //Find productByName
    // @PostMapping("")
    // public String postMethodName(@RequestBody String entity) {
    //     //TODO: process POST request
    //     return entity;
    // }
    //Update sản phẩm
    @PutMapping
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable UUID productId, @RequestBody ProductCreateRequest request) {
        Product productToUpdate = productConvert.productCreateRequestConver(request);

        Product updateProduct = productService.updateProduct(productId, productToUpdate);
        ProductResponse response = productConvert.productConvertToProductResponse(updateProduct);

        return ResponseEntity.ok(response);
    }

    //Xóa sản phẩm 
    @DeleteMapping
    public ResponseEntity<String> deleteProduct(@PathVariable UUID productId) {
        try {
            productService.deleteProduct(productId);;
            return ResponseEntity.ok("Product deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Product.");
        }
    }

    // Tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam("keyword") String keyword) {
        List<Product> products = productService.searchProducts(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Lọc sản phẩm theo danh mục, giá, và từ khóa
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(value = "category", required = false) UUID category,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "keyword", required = false) String keyword) {
        List<Product> products = productService.filterProducts(category, minPrice, maxPrice, keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
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
    public ResponseEntity<List<Product>> getProductBySeller(@PathVariable("sellerId") UUID sellerId) {
        List<Product> products = productService.getProductBySeller(sellerId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Lấy tất cả sản phẩm chưa được kích hoạt
    @GetMapping("/unactive")
    public ResponseEntity<List<Product>> getAllProductUnactive() {
        List<Product> products = productService.getAllProductUnactive();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Kích hoạt sản phẩm theo productId
    @PutMapping("/{id}/activate")
    public ResponseEntity<Product> activateProduct(@PathVariable("id") UUID productId) {
        Product activatedProduct = productService.activateProduct(productId);
        return new ResponseEntity<>(activatedProduct, HttpStatus.OK);
    }

    // Vô hiệu hóa sản phẩm theo productId
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Product> deactivateProduct(@PathVariable("id") UUID productId) {
        Product deactivatedProduct = productService.deactiveProduct(productId);
        return new ResponseEntity<>(deactivatedProduct, HttpStatus.OK);
    }

    //Sản phẩm liên quan
    //Sản phẩm yêu thích
}
