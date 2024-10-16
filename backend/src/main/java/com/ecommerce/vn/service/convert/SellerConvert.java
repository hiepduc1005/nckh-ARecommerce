package com.ecommerce.vn.service.convert;

import java.time.LocalDateTime;

import com.ecommerce.vn.dto.seller.SellerCreateRequest;
import com.ecommerce.vn.dto.seller.SellerResponse;
import com.ecommerce.vn.dto.seller.SellerUpdateRequest;
import com.ecommerce.vn.entity.seller.Seller;
import com.ecommerce.vn.entity.user.User;

public class SellerConvert {

    public Seller sellerCreateConvert(SellerCreateRequest request) {
        if (request == null) {
            return null;
        }

        Seller seller = new Seller();
        seller.setUser(new User(request.getUserId()));
        seller.setShopName(request.getShopName());
        seller.setPickupAddress(request.getPickupAddress());
        seller.setShippingProvider(request.getShippingProvider());
        seller.setActive(true);
        seller.setIsDeleted(false);
        seller.setCreatedAt(LocalDateTime.now());
        seller.setUpdatedAt(LocalDateTime.now());

        return seller;
    }

    public Seller sellerUpdateConvert(SellerUpdateRequest request, Seller existingSeller) {
        if (request == null || existingSeller == null) {
            return null;
        }

        if (request.getShopName() != null) {
            existingSeller.setShopName(request.getShopName());
        }
        if (request.getPickupAddress() != null) {
            existingSeller.setPickupAddress(request.getPickupAddress());
        }
        if (request.getShippingProvider() != null) {
            existingSeller.setShippingProvider(request.getShippingProvider());
        }
        if (request.getActive() != null) {
            existingSeller.setActive(request.getActive());
        }

        return existingSeller;
    }

    public SellerResponse sellerConvertToResponse(Seller seller) {
        if (seller == null) {
            return null;
        }

        return new SellerResponse(
                seller.getId(),
                seller.getShopName(),
                seller.getPickupAddress(),
                seller.getShippingProvider(),
                seller.getActive(),
                seller.getCreatedAt(),
                seller.getUpdatedAt()
        );
    }
}
