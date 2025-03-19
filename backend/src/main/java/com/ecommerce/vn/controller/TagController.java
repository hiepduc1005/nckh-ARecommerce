package com.ecommerce.vn.controller;

import com.ecommerce.vn.dto.tag.TagCreateRequest;
import com.ecommerce.vn.dto.tag.TagResponse;
import com.ecommerce.vn.dto.tag.TagUpdateRequest;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.service.convert.TagConvert;
import com.ecommerce.vn.service.tag.TagService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("api/v1/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @Autowired
    private TagConvert tagConvert;

    // Tạo thẻ mới
    @PostMapping
    public ResponseEntity<TagResponse> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
    	System.out.println(tagCreateRequest.toString());
    	Tag tagEntity = tagService.createTag(tagCreateRequest.getTagName(), tagCreateRequest.getActive());
        
        
        TagResponse response = tagConvert.tagConvertToTagResponse(tagEntity);
        return ResponseEntity.ok(response);
    }

    // Cập nhật thẻ
    @PutMapping
    public ResponseEntity<TagResponse> updateTag(@RequestBody TagUpdateRequest tagUpdateRequest) {
        Tag updatedTag = tagService.updateTag(tagUpdateRequest.getId(),tagUpdateRequest.getTagName(), tagUpdateRequest.getActive()); // Tìm thẻ hiện có (thay thế bằng phương thức tìm thẻ nếu cần)
        TagResponse response = tagConvert.tagConvertToTagResponse(updatedTag);
        return ResponseEntity.ok(response);
    }

    // Xóa thẻ
    @DeleteMapping("/{tagId}")
    public ResponseEntity<String> deleteTag(@PathVariable("tagId") UUID tagId) {
        try {
            tagService.deleteTag(tagId);
            return ResponseEntity.ok("Tag deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the Tag.");
        }
    }

    // Lấy tất cả các thẻ
    @GetMapping
    public ResponseEntity<List<TagResponse>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        List<TagResponse> tagResponses = tags.stream()
                .map(tagConvert::tagConvertToTagResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tagResponses);
    }

    // Thêm thẻ vào sản phẩm
    @PostMapping("/addTagToProduct")
    public ResponseEntity<String> addTagToProduct(@RequestParam(name = "productId") UUID productId, @RequestParam(name = "tagId") UUID tagId) {
    	try {
    		tagService.addTagToProduct(productId, tagId);    		
    		return ResponseEntity.ok().build();
    	}catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    	}
    }

    // Xóa thẻ khỏi sản phẩm
    @DeleteMapping("/removeTagFromProduct")
    public ResponseEntity<String> removeTagFromProduct(@RequestParam(name = "productId") UUID productId, @RequestParam(name = "tagId") UUID tagId) {
    	try {
    		tagService.removeTagFromProduct(productId, tagId);    		
    		return ResponseEntity.ok().build();
    	}catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    	}
    }


    // Kiểm tra thẻ đã tồn tại hay chưa
    @GetMapping("/exists")
    public ResponseEntity<Boolean> isTagExist(@RequestParam String tagName) {
        boolean exists = tagService.isTagExist(tagName);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping("/pagination")
    public ResponseEntity<Page<TagResponse>> getBrandsWithPaginationAndSorting(
            @RequestParam("page") int page,
            @RequestParam("size") int size,
            @RequestParam(value ="sortBy" , required = false) String sortBy) {
    	
    	Page<Tag> tags = tagService.getTagsWithPaginationAndSorting(page, size, sortBy);
        
    	Page<TagResponse> tagResponses = tags.map(tag -> tagConvert.tagConvertToTagResponse(tag));
    	return new ResponseEntity<>(tagResponses, HttpStatus.OK);
   }
}
