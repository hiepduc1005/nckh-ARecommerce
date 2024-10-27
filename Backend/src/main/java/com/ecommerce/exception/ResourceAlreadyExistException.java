package com.ecommerce.exception;

import java.util.UUID;

public class ResourceAlreadyExistException extends RuntimeException {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    private String resourceName;

    private String field;

    private String fieldString;

    private UUID fieldId;

    public ResourceAlreadyExistException(String resourceName, String field, String fieldString) {
        super(String.format("%s with %s=%s already exist!", resourceName, field, fieldString));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldString = fieldString;
    }

    public ResourceAlreadyExistException(String resourceName, String field, UUID fieldId) {
        super(String.format("%s with %s=%s already exist!", resourceName, field, fieldId.toString()));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldId = fieldId;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getFieldString() {
        return fieldString;
    }

    public void setFieldString(String fieldString) {
        this.fieldString = fieldString;
    }

    public UUID getFieldId() {
        return fieldId;
    }

    public void setFieldId(UUID fieldId) {
        this.fieldId = fieldId;
    }

    public static long getSerialversionuid() {
        return serialVersionUID;
    }

}
