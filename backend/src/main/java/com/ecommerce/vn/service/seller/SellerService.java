package com.ecommerce.vn.service.seller;

import com.ecommerce.vn.entity.seller.Seller;

public interface SellerService {
	
	Seller createSeller(Seller seller);
	
	Seller updateSeller(Seller sellerUpdate);
	
}
