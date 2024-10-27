package com.ecommerce.service.convert;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.ecommerce.dto.category.CategoryResponse;
import com.ecommerce.dto.product.ProductCreateRequest;
import com.ecommerce.dto.product.ProductResponse;
import com.ecommerce.dto.product.ProductUpdateRequest;
import com.ecommerce.dto.tag.TagResponse;
import com.ecommerce.entity.attribute.Attribute;
import com.ecommerce.entity.product.Category;
import com.ecommerce.entity.product.Product;
import com.ecommerce.entity.product.Tag;
import com.ecommerce.repository.AttributeRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.TagRepository;

public class ProductConvert {

    @Autowired
    private TagConvert tagConvert;

    @Autowired
    private CategoryConvert categoryConvert;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    public Product productCreateRequestConver(ProductCreateRequest productCreateRequest) {

        if (productCreateRequest == null) {
            return null;
        }

        Set<Category> categories = categoryRepository.findAllById(productCreateRequest.getCategoryIds())
                .stream().collect(Collectors.toSet());
        Set<Tag> tags = tagRepository.findAllById(productCreateRequest.getTagIds())
                .stream().collect(Collectors.toSet());
        Set<Attribute> attributes = attributeRepository.findAllById(productCreateRequest.getAttributeIds())
                .stream().collect(Collectors.toSet());

        Product product = new Product();
        product.setProductName(productCreateRequest.getProductName());
        product.setDescription(productCreateRequest.getDescription());
        product.setShortDescription(productCreateRequest.getShortDescription());
        product.setImage(productCreateRequest.getImage());
        product.setCategories(categories);
        product.setTags(tags);
        product.setAttributes(attributes);

        return product;
    }

    public Product productUpdateConvert(ProductUpdateRequest request, Product product) {
        if (request == null || product == null) {
            return null;
        }
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setShortDescription(request.getDescription());
        product.setImagePath(request.getImagePath());
        product.setActive(request.getActive());

        return product;
    }

    public ProductResponse productConvertToProductResponse(Product product) {
        if (product == null) {
            return null;
        }
        Set<CategoryResponse> categoryResponses = product.getCategories().stream()
                .map(categoryConvert::categoryConvertToCategoryResponse)
                .collect(Collectors.toSet());
        Set<TagResponse> tagResponses = product.getTags().stream()
                .map(tagConvert::tagConvertToTagResponse)
                .collect(Collectors.toSet());

        return new ProductResponse(
                product.getId(),
                product.getActive(),
                product.getProductName(),
                product.getDescription(),
                product.getShortDescription(),
                product.getImagePath(),
                categoryResponses,
                tagResponses,
                product.getCreatedAt(),
                product.getUpdateAt(),
                product.getCreatedBy(),
                product.getUpdatedBy()
        );
    }

}
