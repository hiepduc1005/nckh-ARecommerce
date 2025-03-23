package com.ecommerce.vn.entity.attribute;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Variant;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "attribute_values")
public class AttributeValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.PERSIST)
    @JoinColumn(name = "attribute_id", nullable = false)
    private Attribute attribute;

    @Column(name = "attribute_value", nullable = false)
    private String attributeValue;
    
    @ManyToMany(mappedBy = "attributeValues",fetch = FetchType.LAZY)
    private List<Variant> variants = new ArrayList<Variant>();
    
    

	public List<Variant> getVariants() {
		return variants;
	}

	public void setVariants(List<Variant> variants) {
		this.variants = variants;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public Attribute getAttribute() {
		return attribute;
	}

	public void setAttribute(Attribute attribute) {
		this.attribute = attribute;
	}

	public String getAttributeValue() {
		return attributeValue;
	}

	public void setAttributeValue(String attributeValue) {
		this.attributeValue = attributeValue;
	}
    
    
}
