package com.ecommerce.dto.cart;

import java.util.UUID;

public class CartCreateRequest {

    private UUID userId;

    public CartCreateRequest() {
    }

    public CartCreateRequest(UUID userId) {
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }
}
