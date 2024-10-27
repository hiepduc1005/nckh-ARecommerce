package com.ecommerce.service.convert;

import com.ecommerce.dto.tag.TagCreateRequest;
import com.ecommerce.dto.tag.TagResponse;
import com.ecommerce.dto.tag.TagUpdateRequest;
import com.ecommerce.entity.product.Tag;

public class TagConvert {

    public Tag tagCreateConvert(TagCreateRequest tagCreateRequest) {
        if (tagCreateRequest == null) {
            return null;
        }

        Tag tag = new Tag();
        tag.setTagName(tagCreateRequest.getTagName());

        return tag;
    }

    public Tag tagUpdateConvert(TagUpdateRequest tagUpdateRequest, Tag tag) {
        if (tagUpdateRequest == null || tag == null) {
            throw new IllegalArgumentException("Tag or TagUpdateRequest must not be null");
        }

        if (tagUpdateRequest.getTagName() != null) {
            tag.setTagName(tagUpdateRequest.getTagName());
        }

        if (tagUpdateRequest.getActive() != null) {
            tag.setActive(tagUpdateRequest.getActive());
        }

        return tag;
    }

    public TagResponse tagConvertToTagResponse(Tag tag) {
        if (tag == null) {
            return null;
        }

        return new TagResponse(
                tag.getId(),
                tag.getTagName(),
                tag.getActive(),
                tag.getCreatedAt(),
                tag.getUpdateAt(),
                tag.getCreatedBy(),
                tag.getUpdatedBy()
        );
    }
}
