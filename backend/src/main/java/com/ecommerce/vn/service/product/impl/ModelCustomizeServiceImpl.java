package com.ecommerce.vn.service.product.impl;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.ItemType;
import com.ecommerce.vn.entity.product.ModelCustomize;
import com.ecommerce.vn.repository.ModelCustomizeRepository;
import com.ecommerce.vn.service.product.ModelCustomizeService;


@Service
@Transactional
public class ModelCustomizeServiceImpl implements ModelCustomizeService{
	
	@Autowired
	private ModelCustomizeRepository modelRepository;

	@Override
	public ModelCustomize createModel(ModelCustomize model) {
		
		return modelRepository.save(model);
	}

	@Override
	public ModelCustomize updateModel(ModelCustomize modelUpdate) {
		if(modelUpdate.getId() == null) {
			throw new RuntimeException("Model id must not null");
		}
		return modelRepository.save(modelUpdate);
	}

	@Override
	@Transactional(readOnly = true)
	public Page<ModelCustomize> getModelByType(ItemType itemType, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return modelRepository.getModelByType(itemType, pageable);
	}

	@Override
	public void deleteModel(UUID modelId) {
		ModelCustomize model = getModelById(modelId);
		model.setActive(false);
		updateModel(model);
	}

	@Override
	public ModelCustomize getModelById(UUID modelId) {
		if(modelId == null) {
			throw new RuntimeException("Model id must not null");
		}
		ModelCustomize model = modelRepository.findById(modelId)
				.orElseThrow(() -> new RuntimeException("Cant not found model with id: " + modelId));
		return model;
	}

	@Override
	@Transactional(readOnly = true)
	public Page<ModelCustomize> getModelsPagiante(int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return modelRepository.findAll(pageable);
	}

}
