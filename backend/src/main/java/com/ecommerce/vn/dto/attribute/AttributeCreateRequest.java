package com.ecommerce.vn.dto.attribute;



public class AttributeCreateRequest {
	private String name;


	@Override
	public String toString() {
		return "AttributeCreateRequest [name=" + name + " ]";
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}

	
	
}
