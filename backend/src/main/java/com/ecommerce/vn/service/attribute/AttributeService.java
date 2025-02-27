package com.ecommerce.vn.service.attribute;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.attribute.Attribute;



public interface AttributeService {

    Attribute createAttribute(Attribute attribute);

    Attribute updateAttribute( Attribute attributeDetails);

    void deleteAttribute(UUID id);

    Attribute getAttributeById(UUID id);

    List<Attribute> getAllAttributes();
    
    Attribute createAttributeIfExist(String name);
}

