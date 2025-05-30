package com.ecommerce.vn.entity.order;

import java.util.UUID;

import com.ecommerce.vn.entity.product.ModelDesign;
import com.ecommerce.vn.entity.product.Variant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {
	
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variant_id", nullable = true)
	private Variant variant;	
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "design_id", nullable = true)
	private ModelDesign modelDesign;
	 
	@Column(name = "is_customized", nullable = false)
	private Boolean isCustomized = false;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "order_id")
	private Order order;
	
	private Integer quantity;
	
	

	public ModelDesign getModelDesign() {
		return modelDesign;
	}

	public void setModelDesign(ModelDesign modelDesign) {
		this.modelDesign = modelDesign;
	}

	public Boolean getIsCustomized() {
		return isCustomized;
	}

	public void setIsCustomized(Boolean isCustomized) {
		this.isCustomized = isCustomized;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}


	public Variant getVariant() {
		return variant;
	}

	public void setVariant(Variant variant) {
		this.variant = variant;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}


	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	
	
}
