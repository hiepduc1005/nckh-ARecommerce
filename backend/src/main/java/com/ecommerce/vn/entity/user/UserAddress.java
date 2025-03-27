package com.ecommerce.vn.entity.user;

import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_addresses")
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "phone", nullable = false)
    private String phone;
    
    @Column(name = "address", nullable = false)
    private String address;
    
    @Column(name = "specific_address", nullable = false)
    private String specificAddress;
    
    @Column(name = "is_default")
    private Boolean isDefault;
    
    // Constructor mặc định
    public UserAddress() {
    }
    
    // Constructor đầy đủ
    public UserAddress(UUID id, User user, String name, String phone, String address, 
                      String specificAddress, Boolean isDefault) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.specificAddress = specificAddress;
        this.isDefault = isDefault;
    }
    
    // Getter and Setter
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
   
    public String getSpecificAddress() {
		return specificAddress;
	}

	public void setSpecificAddress(String specificAddress) {
		this.specificAddress = specificAddress;
	}

	public Boolean isDefault() {
        return isDefault;
    }
    
    public void setDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }
}