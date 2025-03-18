package com.ecommerce.vn.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.product.BrandCreateRequest;
import com.ecommerce.vn.dto.product.BrandResponse;
import com.ecommerce.vn.dto.product.BrandUpdateRequest;
import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.entity.product.Brand;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.service.FileUploadService;
import com.ecommerce.vn.service.convert.BrandConvert;
import com.ecommerce.vn.service.product.BrandService;

@RestController
@RequestMapping("api/v1/brands")
public class BrandController {

	@Autowired
	public BrandService brandService;
	
	@Autowired
	public BrandConvert brandConvert;
	
	@Autowired
    private FileUploadService fileUploadService;

	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> createBrand(
			@RequestPart("brand") BrandCreateRequest brandCreateRequest,
			@RequestPart("image") MultipartFile image
			){
		
		if(image == null) {
    		return ResponseEntity.badRequest().body("Brand image is empty!");
    	}
		
		Brand brand = brandConvert.brandCreateRequestConvertToBrand(brandCreateRequest);
		
		String imagePath = fileUploadService.uploadFileToServer(image);
		
		brand.setImagePath(imagePath);
		
		brand = brandService.createBrand(brand);
		BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(brand);
		
		return ResponseEntity.ok(brandResponse);
		
	}
	
	@PutMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<?> updateBrand(
			@RequestPart("brand") BrandUpdateRequest brandUpdateRequest,
			@RequestPart("image") MultipartFile image
			){
		
		if(image == null) {
    		return ResponseEntity.badRequest().body("Brand image is empty!");
    	}
		
		Brand brand = brandConvert.brandUpdateRequestConvertToBrand(brandUpdateRequest);
		
		String imagePath = fileUploadService.uploadFileToServer(image);
		
		brand.setImagePath(imagePath); 
		
		brand = brandService.updateBrand(brand);
		BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(brand);
		
		return ResponseEntity.ok(brandResponse);
		
	}
	
	@GetMapping("/pagination")
    public ResponseEntity<Page<BrandResponse>> getBrandsWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Brand> brands = brandService.getBrandsWithPaginationAndSorting(page, size, sortBy);
        
    	Page<BrandResponse> brandResponses = brands.map(brand -> brandConvert.brandConvertToBrandResponse(brand));
    	return new ResponseEntity<>(brandResponses, HttpStatus.OK);
   }
	
	@GetMapping("/slug/{slug}")
	public ResponseEntity<BrandResponse> getBrandBySulg(@PathVariable("slug") String slug){
		Brand brand = brandService.getBrandBySlug(slug);
		BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(brand);
		
		return new ResponseEntity<>(brandResponse, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<BrandResponse> getBrandById(@PathVariable("id") UUID id){
		Brand brand = brandService.getBrandById(id);
		BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(brand);
		
		return new ResponseEntity<>(brandResponse, HttpStatus.OK);
	}
	
	@GetMapping("/name/{name}")
	public ResponseEntity<BrandResponse> getBrandByName(@PathVariable("name") String name){
		Brand brand = brandService.getBrandByName(name);
		BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(brand);
		
		return new ResponseEntity<>(brandResponse, HttpStatus.OK);
	}
	
	@DeleteMapping("/{brandId}")
	public ResponseEntity<String> deleteBrand(@PathVariable("brandId") UUID brandId){
		brandService.deleteBrand(brandId);
		
		return ResponseEntity.ok("Delete brand success!");
	}
	 
	 
	 
}
