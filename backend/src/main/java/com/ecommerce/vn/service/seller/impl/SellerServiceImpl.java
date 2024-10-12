package com.ecommerce.vn.service.seller.impl;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.seller.Seller;
import com.ecommerce.vn.exception.ResourceAlreadyExistException;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.SellerRepository;
import com.ecommerce.vn.service.seller.SellerService;

@Service
public class SellerServiceImpl implements SellerService{

   @Autowired
   private SellerRepository sellerRepository;

	@Override
	public Seller createSeller(Seller seller) {
		if (seller.getId() != null && sellerRepository.existsById(seller.getId())) {
	        throw new ResourceAlreadyExistException("Seller", "sellerId", seller.getId());
	    }
	    return sellerRepository.save(seller);
	}
	
	@Override
	public Seller updateSeller(Seller sellerUpdate) {
		findSellerByUuid(sellerUpdate.getId());
		
		return sellerRepository.save(sellerUpdate);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Seller findSellerByUuid(UUID sellerId) {
	    return sellerRepository.findById(sellerId)
	    .orElseThrow( () -> new ResourceNotFoundException("Seller", "sellerId", sellerId));
	}
	
	@Override
	@Transactional(readOnly = true)
	public Seller findSellerByShopName(String shopname) {
	   return sellerRepository.findByShopName(shopname)
	   .orElseThrow(() -> new ResourceNotFoundException("Seller", "shopname", shopname));
	}
	
	@Override
	public void deleteSellerByUuid(UUID sellerId) {
		Seller seller = findSellerByUuid(sellerId);

        sellerRepository.delete(seller);
    
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<Seller> findAllSeller() {
	    return sellerRepository.findAll();
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<Seller> findSellersByStatus(Boolean active) {
		if(active == null) {
			throw new RuntimeException("Active must not be null");
		}
		return sellerRepository.findSellersByActive(active);
	}
	
	@Override
	@Transactional
	public Seller activateSeller(UUID sellerId) {
		Seller seller = findSellerByUuid(sellerId);	
		
		seller.setActive(true);
		
		return seller;
	}
	
	@Override
	@Transactional
	public Seller deactiveSeller(UUID sellerId) {
		Seller seller = findSellerByUuid(sellerId);	
		
		seller.setActive(false);
		
		return seller;
	}
	
	@Override
	@Transactional(readOnly = true)
	public Long getTotalOrdersBySeller(UUID sellerId) {
		return sellerRepository.countOrderBySellerId(sellerId);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Long getTotalSalesBySeller(UUID sellerId) {
		return sellerRepository.totalSalesBySeller(sellerId);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Set<Product> getTotalProductBySeller(UUID sellerId) {
		Seller seller = findSellerByUuid(sellerId);	
		
		return seller.getProducts();
	}
	
	@Override
	@Transactional
	public Seller findSellerByEmail(String email) {
		return sellerRepository.findSellerByEmail(email).orElseThrow(
				() -> new ResourceNotFoundException("Seller", "email", email));
		
	}
	
	@Override
	@Transactional
	public Seller findSellerByPhonenum(String phonenum) {
		return sellerRepository.findSellerByPhonenum(phonenum).orElseThrow(
				() -> new ResourceNotFoundException("Seller", "phonenum", phonenum));
	}

   
}
