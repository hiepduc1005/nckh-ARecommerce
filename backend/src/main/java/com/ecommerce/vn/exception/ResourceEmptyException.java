package com.ecommerce.vn.exception;

public class ResourceEmptyException extends RuntimeException{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	private String resourceName;
	

	public ResourceEmptyException(String resourceName) {
		super(String.format("%s is empty!",resourceName));
		this.resourceName = resourceName;
		
	}
	

	
	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	
}
