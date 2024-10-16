package com.ecommerce.vn.dto.seller;

public class SellerUpdateRequest {

    private String shopName;
    private String pickupAddress;
    private String shippingProvider;
    private Boolean active;

    public SellerUpdateRequest(String shopName, String pickupAddress,
            String shippingProvider, Boolean active) {
        this.shopName = shopName;
        this.pickupAddress = pickupAddress;
        this.shippingProvider = shippingProvider;
        this.active = active;
    }

    // Getter và Setter
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
}
