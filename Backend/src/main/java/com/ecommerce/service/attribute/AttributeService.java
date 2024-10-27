package com.ecommerce.service.attribute;

import java.util.List;
import java.util.UUID;

import com.ecommerce.entity.attribute.Attribute;



public interface AttributeService {

    Attribute createAttribute(Attribute attribute);

    Attribute updateAttribute(UUID id, Attribute attributeDetails);

    void deleteAttribute(UUID id);

    Attribute getAttributeById(UUID id);

    List<Attribute> getAllAttributes();
}

