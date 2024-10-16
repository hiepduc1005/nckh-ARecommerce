package com.ecommerce.vn.dto.seller;

import java.time.LocalDateTime;
import java.util.UUID;

public class SellerResponse {

    private UUID id;
    private String shopName;
    private String pickupAddress;
    private String shippingProvider;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SellerResponse(UUID id, String shopName, String pickupAddress, String shippingProvider,
            Boolean active, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.shopName = shopName;
        this.pickupAddress = pickupAddress;
        this.shippingProvider = shippingProvider;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getter và Setter
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getShippingProvider() {
        return shippingProvider;
    }

    public void setShippingProvider(String shippingProvider) {
        this.shippingProvider = shippingProvider;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
