package com.ecommerce.vn.service.convert;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeProductResponse;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.product.BrandResponse;
import com.ecommerce.vn.dto.product.ProductCreateRequest;
import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.dto.product.ProductUpdateRequest;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.dto.tag.TagResponse;
import com.ecommerce.vn.entity.product.Brand;
import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.repository.AttributeRepository;
import com.ecommerce.vn.repository.CategoryRepository;
import com.ecommerce.vn.repository.TagRepository;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.entity.attribute.Attribute;

@Service
public class ProductConvert {
    @Autowired
    private TagConvert tagConvert;

    @Autowired
    private CategoryConvert categoryConvert;
    
    @Autowired
    private RatingConvert ratingConvert;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private AttributeConvert attributeConvert;
    
    @Autowired
    private BrandConvert brandConvert;
    
    @Autowired
    private ProductService productService;
    
  
    private int count = 0;

    public Product productCreateRequestConver(ProductCreateRequest productCreateRequest){

        if (productCreateRequest == null) {
            return null;
        }

        List<Category> categories = categoryRepository.findAllById(productCreateRequest.getCategoryIds())
        		.stream().toList();
        List<Tag> tags = tagRepository.findAllById(productCreateRequest.getTagIds())
        		.stream().toList();
          
        List<Attribute> attributes = attributeRepository.findAllById(productCreateRequest.getAttributeIds())
                .stream().toList();
        
        Product product = new Product();
        
		String slug = String.join("-", productCreateRequest.getProductName().toLowerCase().split(" ")) + "-" + count++;

		product.setSlug(slug);
        product.setProductName(productCreateRequest.getProductName());
        product.setDescription(productCreateRequest.getDescription());
        product.setShortDescription(productCreateRequest.getShortDescription());
        product.setAttributes(attributes);
        product.setTags(tags);
        product.setCategories(categories);
        product.setActive(productCreateRequest.getActive());
        
        Brand brand = new Brand();
        brand.setId(productCreateRequest.getBrandId());
        
        product.setBrand(brand);
        product.setSoldQuantity(0);
            
        return product;
    }
    
    public Product productUpdateRequestConver(ProductUpdateRequest productUpdateRequest){

        if (productUpdateRequest == null) {
            return null;
        }

        List<Category> categories = categoryRepository.findAllById(productUpdateRequest.getCategoryIds())
        .stream().collect(Collectors.toList());
        List<Tag> tags = tagRepository.findAllById(productUpdateRequest.getTagIds())
        .stream().collect(Collectors.toList());
        List<Attribute> attributes = attributeRepository.findAllById(productUpdateRequest.getAttributeIds())
        .stream().collect(Collectors.toList());

        Product product = productService.getProductById(productUpdateRequest.getId());
        
		String slug = String.join("-", productUpdateRequest.getProductName().toLowerCase().split(" ")) + "-" + count++;

		product.setSlug(slug);
        product.setId(productUpdateRequest.getId());     
        product.setProductName(productUpdateRequest.getProductName());
        product.setDescription(productUpdateRequest.getDescription());
        product.setShortDescription(productUpdateRequest.getShortDescription());
        product.setCategories(categories);
        product.setTags(tags);
        product.setAttributes(attributes);
        product.setActive(productUpdateRequest.getActive());
        
        Brand brand = new Brand();
        brand.setId(productUpdateRequest.getBrandId());
        
        product.setBrand(brand);
            
        return product;
    }

    public ProductResponse productConvertToProductResponse(Product product){
        if (product == null) {
            return null;
        }
        List<CategoryResponse> categoryResponses = product.getCategories().stream()
            .map(categoryConvert::categoryConvertToCategoryResponse) 
            .collect(Collectors.toList());
        List<TagResponse> tagResponses = product.getTags().stream()
            .map(tagConvert::tagConvertToTagResponse) 
            .collect(Collectors.toList());
        
        List<AttributeProductResponse> attributeResponses = product.getAttributes()
        		.stream()
        		.map((attribute) -> attributeConvert.attributeProductConvertToAttributeProductResponse(attribute) )
        		.toList();
        
        List<RatingResponse> ratingResponses = product.getRatings().stream()
        		.map(ratingConvert::ratingConvertToRatingResponse)
        		.toList();
        
        Double minPrice = product.getVariants().stream()
        		.map(variant -> variant.getPrice())
        		.min(BigDecimal::compareTo)
        		.orElse(BigDecimal.ZERO).doubleValue();
        
        Double maxPrice = product.getVariants().stream()
        		.map(variant -> variant.getPrice())
        		.max(BigDecimal::compareTo)
        		.orElse(BigDecimal.ZERO).doubleValue();
        
        Double rattingValue = product.getRatings().stream()
        		.mapToDouble(ratting -> ratting.getRatingValue())
        		.average()
        		.orElse(5);
        
        Integer stock = product.getVariants()
        		.stream()
        		.mapToInt(variant -> variant.getQuantity())
        		.sum();
        
        BrandResponse brandResponse = brandConvert.brandConvertToBrandResponse(product.getBrand());
        
        
        ProductResponse productResponse = new ProductResponse(
                product.getId(), 
                product.getActive(), 
                product.getProductName(), 
                product.getDescription(), 
                product.getShortDescription(), 
                product.getImagePath(), 
                categoryResponses, 
                tagResponses, 
                attributeResponses,
                product.getCreatedAt(), 
                product.getUpdateAt(), 
                product.getCreatedBy(), 
                product.getUpdatedBy(),
                rattingValue,
                ratingResponses
                ); 
        
        productResponse.setStock(stock);
        productResponse.setSlug(product.getSlug());
        productResponse.setMinPrice(minPrice);
        productResponse.setMaxPrice(maxPrice);
        productResponse.setBrandResponse(brandResponse);
        productResponse.setSolded(product.getSoldQuantity());
        productResponse.setModelPath(product.getModelPath());
        return productResponse;
    }

}
