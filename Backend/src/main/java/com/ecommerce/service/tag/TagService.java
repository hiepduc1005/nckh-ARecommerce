package com.ecommerce.service.tag;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.product.Product;
import com.ecommerce.entity.product.Tag;

public interface TagService {

    Tag createTag(String name);

    Tag updateTag(UUID tagId, String newTagName);

    void deleteTag(UUID tagId);

    Tag findTagById(UUID tagId);

    List<Tag> getAllTags();

    // Thêm thẻ vào sản phẩm
    void addTagToProduct(UUID productId, UUID tagId);

    // Xóa thẻ khỏi sản phẩm
    void removeTagFromProduct(UUID productId, UUID tagId);

    // Tìm sản phẩm theo thẻ
    List<Product> getProductsByTag(UUID tagId);

    boolean isTagExist(String tagName);
}
