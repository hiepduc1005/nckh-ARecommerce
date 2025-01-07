package com.ecommerce.vn.service.rating.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.exception.ResourceNotFoundException;
import com.ecommerce.vn.entity.customer.Customer;
import com.ecommerce.vn.entity.product.Product;
import com.ecommerce.vn.entity.rating.Rating;
import com.ecommerce.vn.repository.CustomerRepository;
import com.ecommerce.vn.repository.ProductRepository;
import com.ecommerce.vn.repository.RatingRepository;
import com.ecommerce.vn.service.rating.RatingService;

@Service
public class RatingServiceImpl implements RatingService {
}
