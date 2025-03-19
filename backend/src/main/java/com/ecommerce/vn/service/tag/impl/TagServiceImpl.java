package com.ecommerce.vn.service.tag.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.product.Tag;
import com.ecommerce.vn.repository.TagRepository;
import com.ecommerce.vn.service.product.ProductService;
import com.ecommerce.vn.service.tag.TagService;

@Service
@Transactional
public class TagServiceImpl implements TagService{
	
	@Autowired
	private TagRepository tagRepository;
	
	@Autowired
	private ProductService productService;

	@Override
	public Tag createTag(String name,Boolean active) {
		Tag tag = new Tag();
		tag.setTagName(name);
		tag.setActive(active);
		return tagRepository.save(tag);
	}

	@Override
	public Tag updateTag(UUID tagId, String newName,Boolean active) {
		Tag tag = getTagById(tagId);
		tag.setTagName(newName);
		tag.setActive(active);
		return tagRepository.save(tag);
	}
	
	@Override
	public Tag getTagById(UUID tagId) {
		if(tagId == null) {
			throw new RuntimeException("TagId is missing");
		}
		
		return tagRepository.findById(tagId).orElseThrow(() -> 
				new RuntimeException("Tag not found with id:" + tagId));
	}


	@Override
	public void deleteTag(UUID tagId) {
		Tag tag = getTagById(tagId);
		tagRepository.delete(tag);
	}

	@Override
	public List<Tag> getAllTags() {
		// TODO Auto-generated method stub
		return tagRepository.findAll();
	}

	@Override
	public void addTagToProduct(UUID productId, UUID tagId) {
		Product product = productService.getProductById(productId);
		Tag tag = getTagById(tagId);
		
	    if (!product.getTags().contains(tag)) {
	        product.getTags().add(tag); // Thêm Tag vào danh sách
	        productService.updateProduct(product); // Lưu lại Product
	    } else {
	        throw new IllegalArgumentException("Tag already exists for this product");
	    }
		
	}

	@Override
	public void removeTagFromProduct(UUID productId, UUID tagId) {
		Product product = productService.getProductById(productId);
		Tag tag = getTagById(tagId);
		
	    if (product.getTags().contains(tag)) {
	        product.getTags().remove(tag); // Thêm Tag vào danh sách
	        productService.updateProduct(product); // Lưu lại Product
	    } else {
	        throw new IllegalArgumentException("Tag does not exist for this product");
	    }
	}


	@Override
	public boolean isTagExist(String tagName) {
		// TODO Auto-generated method stub
		return tagRepository.existsByTagName(tagName);
	}

	@Override
	public List<Tag> getTagsByProduct(Product product) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Tag> getTagByName(String name) {
		
		return tagRepository.findByName(name);
	}

	@Override
	public List<Tag> getActiveTag() {
		// TODO Auto-generated method stub
		return tagRepository.getActiveTag();
	}

	@Override
	public List<Tag> getUnactiveTag() {
		// TODO Auto-generated method stub
		return tagRepository.getUnactiveTag();
	}

	@Override
	@Transactional(readOnly = true)
	public Page<Tag> getTagsWithPaginationAndSorting(int page, int size, String sortBy) {
		Pageable pageable = PageRequest.of(page, size);
		return tagRepository.findAll(pageable);
	}


    
}
