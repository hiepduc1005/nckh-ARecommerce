package com.ecommerce.vn.service.customer.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.vn.entity.customer.Customer;
import com.ecommerce.vn.entity.order.Order;
import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.repository.CustomerRepository;
import com.ecommerce.vn.service.customer.CustomerService;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository; 

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public List<Order> getCustomerOrders(UUID customerId) {
        Customer customer = getCustomerById(customerId);
        return new ArrayList<>(customer.getOrders()); // Trả về danh sách đơn hàng
    }

    @Override
    public void addLoyaltyPoints(UUID customerId, int points) {
        Customer customer = getCustomerById(customerId);
        customer.setLoyaltyPoint(customer.getLoyaltyPoint() + points);
        customerRepository.save(customer); 
    }

    @Override
    public void redeemLoyaltyPoints(UUID customerId, int points) {
        // Đổi điểm thưởng cho khách hàng
        Customer customer = getCustomerById(customerId);
        if (customer.getLoyaltyPoint() < points) {
            throw new IllegalArgumentException("Not enough loyalty points"); 
        }
        customer.setLoyaltyPoint(customer.getLoyaltyPoint() - points);
        customerRepository.save(customer); 
    }

    @Override
    public Customer getCustomerById(UUID customerId, UUID UserId, String email) {
         // Lấy thông tin khách hàng theo ID, User ID và email
         return customerRepository.findById(customerId)
         .filter(customer -> 
             customer.getUser().getId().equals(userId) && 
             customer.getUser().getEmail().equals(email))
         .orElseThrow(() -> new ResourceNotFoundException("Customer", "id, userId or email", customerId));
    }
}
