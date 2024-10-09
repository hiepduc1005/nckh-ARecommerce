package com.ecommerce.vn.service.customer;

import java.util.List;
import java.util.UUID;

import com.ecommerce.vn.entity.customer.Customer;
import com.ecommerce.vn.entity.order.Order;

public interface CustomerService {

    Customer getCustomerById(UUID customerId, UUID UserId, String email); 

    List<Customer> getAllCustomers();

    List<Order> getCustomerOrders(UUID customerId); 

    void addLoyaltyPoints(UUID customerId, int points);

    void redeemLoyaltyPoints(UUID customerId, int points); 

}