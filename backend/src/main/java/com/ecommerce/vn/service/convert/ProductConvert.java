package com.ecommerce.vn.service.convert;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.attribute.AttributeResponse;
import com.ecommerce.vn.dto.category.CategoryResponse;
import com.ecommerce.vn.dto.product.ProductCreateRequest;
import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.dto.product.ProductUpdateRequest;
import com.ecommerce.vn.dto.ratting.RatingResponse;
import com.ecommerce.vn.dto.tag.TagResponse;
import com.ecommerce.vn.entity.product.Category;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.repository.AttributeRepository;
import com.ecommerce.vn.repository.CategoryRepository;
import com.ecommerce.vn.repository.TagRepository;
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

    public Product productCreateRequestConver(ProductCreateRequest productCreateRequest){

        if (productCreateRequest == null) {
            return null;
        }

//        Set<Category> categories = categoryRepository.findAllById(productCreateRequest.getCategoryIds())
//        .stream().collect(Collectors.toSet());
//        Set<Tag> tags = tagRepository.findAllById(productCreateRequest.getTagIds())
//        .stream().collect(Collectors.toSet());
//      
        
        List<Attribute> attributes = productCreateRequest.getAttributeCreateRequests()
        		.stream()
        		.map(attributeCreateRequest -> { 
        			return attributeConvert.attributeCreateRequestConvert(attributeCreateRequest);
        			})
        		.toList();
        
        Product product = new Product();
        product.setProductName(productCreateRequest.getProductName());
        product.setDescription(productCreateRequest.getDescription());
        product.setShortDescription(productCreateRequest.getShortDescription());
        product.setAttributes(attributes);
            
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

        Product product = new Product();
        product.setId(productUpdateRequest.getId());     
        product.setProductName(productUpdateRequest.getProductName());
        product.setDescription(productUpdateRequest.getDescription());
        product.setShortDescription(productUpdateRequest.getShortDescription());
        product.setCategories(categories);
        product.setTags(tags);
        product.setAttributes(attributes);
            
        return product;
    }

    public ProductResponse productConvertToProductResponse(Product product){
        if (product == null) {
            return null;
        }
        Set<CategoryResponse> categoryResponses = product.getCategories().stream()
            .map(categoryConvert::categoryConvertToCategoryResponse) 
            .collect(Collectors.toSet());
        Set<TagResponse> tagResponses = product.getTags().stream()
            .map(tagConvert::tagConvertToTagResponse) 
            .collect(Collectors.toSet());
        
        List<AttributeResponse> attributeResponses = product.getAttributes()
        		.stream()
        		.map((attribute) -> attributeConvert.attributeConvertToAttributeResponse(attribute) )
        		.toList();
        
        List<RatingResponse> ratingResponses = product.getRatings().stream()
        		.map(ratingConvert::ratingConvertToRatingResponse)
        		.toList();
        
        Double minPrice = product.getVariants().stream()
        		.map(variant -> variant.getPrice())
        		.min(BigDecimal::compareTo)
        		.orElse(BigDecimal.ZERO).doubleValue();
        
        Double rattingValue = product.getRatings().stream()
        		.mapToDouble(ratting -> ratting.getRatingValue())
        		.average()
        		.orElse(0);
        
        


        return new ProductResponse(
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
            minPrice,
            rattingValue,
            ratingResponses
            ); 
    }

}
