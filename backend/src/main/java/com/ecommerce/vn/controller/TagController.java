package com.ecommerce.vn.controller;

import com.ecommerce.vn.dto.product.ProductResponse;
import com.ecommerce.vn.dto.tag.TagCreateRequest;
import com.ecommerce.vn.dto.tag.TagResponse;
import com.ecommerce.vn.dto.tag.TagUpdateRequest;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.service.convert.TagConvert;
import com.ecommerce.vn.service.tag.TagService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.ecommerce.vn.service.convert.ProductConvert;

@RestController
@RequestMapping("/tags")
public class TagController {

    @Autowired
    private ProductConvert productConvert;

    @Autowired
    private TagService tagService;

    @Autowired
    private TagConvert tagConvert;

    // Tạo thẻ mới
    @PostMapping("/create")
    public ResponseEntity<TagResponse> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
        Tag tagEntity = tagConvert.tagCreateConvert(tagCreateRequest);
        Tag createdTag = tagService.createTag(tagEntity.getTagName());
        TagResponse response = tagConvert.tagConvertToTagResponse(createdTag);
        return ResponseEntity.ok(response);
    }

    // Cập nhật thẻ
    @PutMapping("/update/{tagId}")
    public ResponseEntity<TagResponse> updateTag(@PathVariable UUID tagId, @RequestBody TagUpdateRequest tagUpdateRequest) {
        Tag existingTag = tagService.updateTag(tagId, null); // Tìm thẻ hiện có (thay thế bằng phương thức tìm thẻ nếu cần)
        Tag updatedTagEntity = tagConvert.tagUpdateConvert(tagUpdateRequest, existingTag);
        Tag updatedTag = tagService.updateTag(tagId, updatedTagEntity.getTagName());
        TagResponse response = tagConvert.tagConvertToTagResponse(updatedTag);
        return ResponseEntity.ok(response);
    }

    // Xóa thẻ
    @DeleteMapping("/delete/{tagId}")
    public ResponseEntity<String> deleteTag(@PathVariable UUID tagId) {
        try {
            tagService.deleteTag(tagId);
            return ResponseEntity.ok("Tag deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tag not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Tag.");
        }
    }

    // Lấy tất cả các thẻ
    @GetMapping("/all")
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        List<TagResponse> tagResponses = tags.stream()
                .map(tagConvert::tagConvertToTagResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tagResponses);
    }

    // Thêm thẻ vào sản phẩm
    @PostMapping("/addTagToProduct")
    public ResponseEntity<Void> addTagToProduct(@RequestParam UUID productId, @RequestParam UUID tagId) {
        tagService.addTagToProduct(productId, tagId);
        return ResponseEntity.ok().build();
    }

    // Xóa thẻ khỏi sản phẩm
    @DeleteMapping("/removeTagFromProduct")
    public ResponseEntity<Void> removeTagFromProduct(@RequestParam UUID productId, @RequestParam UUID tagId) {
        tagService.removeTagFromProduct(productId, tagId);
        return ResponseEntity.noContent().build();
    }

    //Tìm sản phẩm theo thẻ
    @GetMapping("/products/{tagId}")
    public ResponseEntity<List<ProductResponse>> getProductsByTag(@PathVariable UUID tagId) {
        List<Product> products = tagService.getProductsByTag(tagId); // Phương thức trả về List<Product>

        List<ProductResponse> productResponses = products.stream()
                .map(productConvert::productConvertToProductResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(productResponses);
    }

    // Kiểm tra thẻ đã tồn tại hay chưa
    @GetMapping("/exists")
    public ResponseEntity<Boolean> isTagExist(@RequestParam String tagName) {
        boolean exists = tagService.isTagExist(tagName);
        return ResponseEntity.ok(exists);
    }
}
