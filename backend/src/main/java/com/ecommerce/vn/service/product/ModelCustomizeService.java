package com.ecommerce.vn.service.product;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.product.ItemType;
import com.ecommerce.vn.entity.product.ModelCustomize;


public interface ModelCustomizeService {

	ModelCustomize createModel(ModelCustomize model);
	ModelCustomize updateModel(ModelCustomize modelUpdate);
	ModelCustomize getModelById(UUID modelId);
	Page<ModelCustomize> getModelByType(ItemType itemType,int page, int size);
	Page<ModelCustomize> getModelsPagiante(int page, int size);

	void deleteModel(UUID modelId);
}
