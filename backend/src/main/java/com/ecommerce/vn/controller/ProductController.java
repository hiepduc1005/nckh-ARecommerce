package com.ecommerce.vn.controller;

import java.util.UUID;
import java.util.Arrays;
import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.ProductCreateRequest;
import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.dto.product.ProductUpdateRequest;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.ProductConvert;
import com.ecommerce.vn.service.product.ProductService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createProduct(
            @RequestPart("image") MultipartFile image,
            @RequestPart("model") MultipartFile model,
            @RequestPart("product")  ProductCreateRequest request) {
    	if(image == null) {
    		return ResponseEntity.badRequest().body("Product image is empty!");
    	}
    	
    	if(model == null) {
    		return ResponseEntity.badRequest().body("Model is empty!");
    	}
    	
        Product product = productConvert.productCreateRequestConver(request);
        String imagePath = fileUploadService.uploadFileToServer(image);
        product.setImagePath(imagePath);
        
        String modelPath = fileUploadService.uploadModelToServer(model);
        product.setModelPath(modelPath);
        
        Product saveProduct = productService.createProduct(product);

        ProductResponse response = productConvert.productConvertToProductResponse(saveProduct);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    //Tìm sản phẩm bằng id
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("productId") UUID productId){
        Product product = productService.findProductByUuid(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }

        ProductResponse productResponse = productConvert.productConvertToProductResponse(product);
        return ResponseEntity.ok(productResponse);
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductResponse> findProductById(@PathVariable("slug") String slug){
        Product product = productService.getProductBySlug(slug);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); 
        }

        ProductResponse productResponse = productConvert.productConvertToProductResponse(product);
        return ResponseEntity.ok(productResponse);
    }

    //Update sản phẩm
    @PutMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateProduct(
            @RequestPart(name = "image", required = false) MultipartFile image, 
            @RequestPart(name = "model", required = false) MultipartFile model,
            @RequestPart("product")  ProductUpdateRequest productUpdateRequest) {
    	
    	Product productToUpdate = productConvert.productUpdateRequestConver(productUpdateRequest);
    	if(image != null) {
    		String imagePath = fileUploadService.uploadFileToServer(image);    		
    		productToUpdate.setImagePath(imagePath);
    	}
    	
    	if(model != null) {
    		String modelPath = fileUploadService.uploadModelToServer(model);    		
    		productToUpdate.setModelPath(modelPath);
    	}
    	
    	
        Product updateProduct = productService.updateProduct(productToUpdate);
        ProductResponse response = productConvert.productConvertToProductResponse(updateProduct);

        return ResponseEntity.ok(response);
    }

    //Xóa sản phẩm 
    @DeleteMapping("/{productId}")
	public ResponseEntity<String> deleteProduct(@PathVariable("productId") UUID productId){
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
    public ResponseEntity<Page<ProductResponse>> filterProducts(
            @RequestParam(value = "page", defaultValue = "0", required = false) int page,
            @RequestParam(value = "size", defaultValue = "8", required = false) int size,
            @RequestParam(value = "categories", required = false, defaultValue = "") String categories,
            @RequestParam(value = "brands", required = false, defaultValue = "") String brands,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "sort", required = false) String sort) {
        
    

    	List<String> listCategory = categories.isEmpty() ? null : Arrays.asList(categories.split(","));
    	List<String> listBrand = brands.isEmpty() ? null : Arrays.asList(brands.split(","));


        Page<Product> products = productService.filterProducts(listCategory, listBrand, minPrice, maxPrice, keyword, page, size,sort);
        
        List<ProductResponse> productResponses = products.getContent().stream()
                .map(productConvert::productConvertToProductResponse)
                .toList();

        Page<ProductResponse> responsePage = new PageImpl<>(productResponses, products.getPageable(), products.getTotalElements());

        return ResponseEntity.ok(responsePage);
    }


    // Phân trang và sắp xếp sản phẩm
    @GetMapping("/pagination")
    public ResponseEntity<Page<ProductResponse>> getProductsWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Product> products = productService.getProductsWithPaginationAndSorting(page, size, sortBy);
        
    	Page<ProductResponse> productResponses = products.map(product -> productConvert.productConvertToProductResponse(product));
    	return new ResponseEntity<>(productResponses, HttpStatus.OK);
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
    public ResponseEntity<List<ProductResponse>> getProductsRelated(@PathVariable("productId") UUID productId) {
        List<Product> products = productService.getRelatedProducts(productId);
        List<ProductResponse> productResponses = products.stream()
        		.map((product) -> 
        			productConvert.productConvertToProductResponse(product)
        			).toList();
        return new ResponseEntity<>(productResponses, HttpStatus.OK);
    }
    
    @GetMapping("/featured")
    public ResponseEntity<Page<ProductResponse>> getProductFeatured(
    		@RequestParam(name = "page", defaultValue = "0") int page,
    		@RequestParam(name = "size" , defaultValue = "8") int size
    		) {
    	
    	Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productService.getFeaturedProducts(pageable);
        
        Page<ProductResponse> response = products.map(product -> productConvert.productConvertToProductResponse(product));

        return new ResponseEntity<>(response, HttpStatus.OK);
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


    
}
