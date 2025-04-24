package com.ecommerce.vn.service.product.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.ModelDesign;
import com.ecommerce.vn.repository.ModelDesignRepository;
import com.ecommerce.vn.service.product.ModelDesignService;

@Service
@Transactional
public class ModelDesignServiceImpl implements ModelDesignService{

	@Autowired
	private ModelDesignRepository modelDesignRepository;
	
	@Override
	public ModelDesign createModelDesign(ModelDesign modelDesign) {
		if(modelDesign.getId() != null) {
			throw new RuntimeException("Model design already exist!");
		}
		return modelDesignRepository.save(modelDesign);
	}

	@Override
	public ModelDesign updateModeldeDesign(ModelDesign modelDesign) {
		if(modelDesign.getId() == null) {
			throw new RuntimeException("Model id must not null");
		}
		return modelDesignRepository.save(modelDesign);
	}

	@Override
	public Page<ModelDesign> getModelDesignBySessionId(String sessionId, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return modelDesignRepository.getModelDesignsBySessionId(sessionId, pageable);
	}

	@Override
	public void deleteModelDesign(UUID modelDesignId) {
		ModelDesign modelDesign = getModelDesignById(modelDesignId);
		modelDesignRepository.delete(modelDesign);
	}

	@Override
	public ModelDesign getModelDesignById(UUID id) {
		if(id == null) {
			throw new RuntimeException("Model design id must not null");
		}
		ModelDesign model = modelDesignRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Cant not found model design with id: " + id));
		return model;

	}

}
