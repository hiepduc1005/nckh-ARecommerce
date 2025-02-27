package com.ecommerce.vn.service.attribute.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.attribute.Attribute;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.AttributeRepository;
import com.ecommerce.vn.service.attribute.AttributeService;


@Service
@Transactional
public class AttributeServiceImpl implements AttributeService {
	
	@Autowired
	private AttributeRepository attributeRepository;

	@Override
	public Attribute createAttribute(Attribute attribute) {
		return attributeRepository.save(attribute);
	}

	@Override
	public Attribute updateAttribute(Attribute attributeDetails) {
		
		return attributeRepository.save(attributeDetails);
	}

	@Override
	public void deleteAttribute(UUID id) {
		if(id != null) {
			attributeRepository.deleteById(id);
			return;
		}
		
		throw new RuntimeException("ID must not null !");
	}

	@Override
	public Attribute getAttributeById(UUID id) {
		Optional<Attribute> attribute = attributeRepository.findById(id);
		if(attribute.isEmpty()) {
			throw new ResourceNotFoundException("Attribute","id", id);
		}
		return attribute.get();
	}

	@Override
	@Transactional(readOnly = true)
	public List<Attribute> getAllAttributes() {
		
		return attributeRepository.findAll();
	}

	@Transactional
	@Override
	public Attribute createAttributeIfExist(String name) {	
		return attributeRepository.findByAttributeName(name).orElseGet(() -> {
			Attribute newAttribute = new Attribute();
	        newAttribute.setAttributeName(name);
	        newAttribute.setActive(true);
	        return attributeRepository.save(newAttribute);
		});
	}

}

