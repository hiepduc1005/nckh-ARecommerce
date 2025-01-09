package com.ecommerce.vn.service.tag;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;

public interface TagService {

    Tag createTag(String name);

    Tag updateTag(UUID tagId, String newName);

    void deleteTag(UUID tagId);
    
    Tag getTagById(UUID tagId);

    List<Tag> getAllTags();
    
    List<Tag> getTagsByProduct(Product product);

    List<Tag> getTagByName(String name);
    
    List<Tag> getActiveTag();
    
    List<Tag> getUnactiveTag();

    // Thêm thẻ vào sản phẩm
    void addTagToProduct(UUID productId, UUID tagId);

    // Xóa thẻ khỏi sản phẩm
    void removeTagFromProduct(UUID productId, UUID tagId);

    // Tìm sản phẩm theo thẻ

    boolean isTagExist(String tagName);
}
