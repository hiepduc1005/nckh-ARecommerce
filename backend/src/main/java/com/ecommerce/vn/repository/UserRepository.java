package com.ecommerce.vn.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ecommerce.vn.entity.user.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>{
    Optional<User> findByEmail(String email);
    Optional<User> findByUserName(String userName);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.active = false")
    List<User> findUnactiveUser();
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findActiveUser();
    
    @Query("""
    	    SELECT u FROM User u
    	    WHERE (
    	        :keyword IS NULL OR :keyword = '' OR
    	        LOWER(u.userName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
    	        LOWER(u.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
    	        LOWER(u.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
    	        LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
    	    )
    	    AND (:active IS NULL OR u.active = :active) ORDER BY u.createdAt DESC
    	""")
    Page<User> getUserPaginate(@Param("keyword") String keyword, @Param("active") Boolean active, Pageable pageable);

} 

