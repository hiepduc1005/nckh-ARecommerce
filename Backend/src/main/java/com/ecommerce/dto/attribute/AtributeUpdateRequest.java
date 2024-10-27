package com.ecommerce.dto.attribute;

public class AtributeUpdateRequest {

    private String attributeName;

    private Boolean update;

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public Boolean getUpdate() {
        return update;
    }

    public void setUpdate(Boolean update) {
        this.update = update;
    }

}
