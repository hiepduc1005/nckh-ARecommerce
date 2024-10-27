package com.ecommerce.service.tag.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.entity.product.Product;
import com.ecommerce.entity.product.Tag;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.TagRepository;
import com.ecommerce.service.tag.TagService;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Tag createTag(String tagName) {
        Tag newTag = new Tag();
        newTag.setTagName(tagName);
        return tagRepository.save(newTag);
    }

    @Override
    public Tag updateTag(UUID tagId, String newTagName) {
        try {
            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thẻ " + tagId));

            tag.setTagName(newTagName);

            return tagRepository.save(tag);

        } catch (Exception e) {
            throw new RuntimeException("Failed to update tag: " + e.getMessage());
        }
    }

    @Override
    public void deleteTag(UUID tagId) {
        try {
            tagRepository.findTagById(tagId);

            tagRepository.deleteById(tagId);
        } catch (Exception e) {
            throw new RuntimeException("Xóa lỗi" + e.getMessage());
        }
    }

    @Override
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    @Override
    public void addTagToProduct(UUID productId, UUID tagId) {
        try {

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

            Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));

            if (!product.getTags().contains(tag)) {
                product.getTags().add(tag); //Thêm ta vào thẻ

                productRepository.save(product);
            } else {
                throw new RuntimeException("Tag is already associated with the product");
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to add tag to product: " + e.getMessage());
        }
    }

    @Override
    public void removeTagFromProduct(UUID productId, UUID tagId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));
        try {
            if (product.getTags().contains(tag)) {
                product.getTags().remove(tag); //Thêm ta vào thẻ

                productRepository.save(product);
            } else {
                throw new RuntimeException("Tag is not associated with the product");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to remove Tag " + e.getMessage());
        }
    }

    @Override
    public List<Product> getProductsByTag(UUID tagId) {

        try {
            tagRepository.findById(tagId)
                    .orElseThrow(() -> new RuntimeException("Tag not found with id: " + tagId));

            return productRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to find Product " + e.getMessage());
        }
    }

    @Override
    public boolean isTagExist(String tagName) {
        return tagRepository.existsByName(tagName);
    }

    @Override
    public Tag findTagById(UUID tagId) {
        return tagRepository.findTagById(tagId);
    }

}
