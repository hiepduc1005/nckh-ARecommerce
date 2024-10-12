package com.ecommerce.vn.service.seller;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.seller.Seller;

public interface SellerService {
	
	Seller createSeller(Seller seller);
	
	Seller updateSeller(Seller sellerUpdate);
	
	Seller findSellerByUuid(UUID sellerId);

	Seller findSellerByShopName(String shopname);

	void deleteSellerByUuid(UUID sellerId);

	List<Seller> findAllSeller();	
	
	List<Seller> findSellersByStatus(Boolean active);
	
	Seller activateSeller(UUID sellerId);
	
	Seller deactiveSeller(UUID sellerId);
	
	Long getTotalOrdersBySeller(UUID sellerId);
	
	Long getTotalSalesBySeller(UUID sellerId);
	
	Set<Product> getTotalProductBySeller(UUID sellerId);
	
	Seller findSellerByEmail(String email);
	
	Seller findSellerByPhonenum(String phonenum);
}
