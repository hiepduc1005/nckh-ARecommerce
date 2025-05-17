package com.ecommerce.vn.entity.product;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class ModelDesign {
	
	@Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

	@Column(name = "session_id")
	private String sessionId;
	
	private String imagePath;
	
	@ManyToOne
	@JoinColumn(name = "model_id", nullable = false)
	private ModelCustomize model;

    @Column(columnDefinition = "json")
	private String colorConfig;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;
	
	private UUID cloneFrom;

	
	

	public UUID getCloneFrom() {
		return cloneFrom;
	}

	public void setCloneFrom(UUID cloneFrom) {
		this.cloneFrom = cloneFrom;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public UUID getId() {
		return id;
	}

	public void setId(UUID id) {
		this.id = id;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public ModelCustomize getModel() {
		return model;
	}

	public void setModel(ModelCustomize model) {
		this.model = model;
	}

	public String getColorConfig() {
		return colorConfig;
	}

	public void setColorConfig(String colorConfig) {
		this.colorConfig = colorConfig;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
    
    
}
