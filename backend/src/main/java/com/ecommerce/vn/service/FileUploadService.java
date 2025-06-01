package com.ecommerce.vn.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadService {

	private final String uploadDir = "src/main/resources/static/uploads";
	private final String uploadModelDir = "src/main/resources/static/uploads/models";
	public String uploadFileToServer(MultipartFile image) {
		try {
			Path uploadPath = Paths.get(uploadDir);
			
			if(!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			
			StringBuffer fileName = new StringBuffer("");		
			fileName.append(UUID.randomUUID());
			fileName.append("_");
			fileName.append(image.getOriginalFilename());
			Path filePath = uploadPath.resolve(fileName.toString());

			Files.write(filePath,image.getBytes());
			
			return "/uploads/" + fileName;
		
		} catch (Exception e) {
			 throw new RuntimeException("Failed to save file: " + image.getOriginalFilename(), e);
		}
	}
	
	public String uploadModelToServer(MultipartFile model) {
		try {
			Path uploadPath = Paths.get(uploadModelDir);
			
			if(!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}
			
			StringBuffer fileName = new StringBuffer("");		
			fileName.append(UUID.randomUUID());
			fileName.append("_");
			fileName.append(model.getOriginalFilename());
			Path filePath = uploadPath.resolve(fileName.toString());

			Files.write(filePath,model.getBytes());
			
			return "/uploads/models/" + fileName;
		
		} catch (Exception e) {
			 throw new RuntimeException("Failed to save file: " + model.getOriginalFilename(), e);
		}
	}
	
	public boolean deleteFileFromServer(String fileName) {
		try {
			// Kiểm tra null và empty
			if (fileName == null || fileName.trim().isEmpty()) {
				return false;
			}
			
			// Loại bỏ prefix "/uploads/" để lấy tên file thực
			String actualFileName = fileName.startsWith("/uploads/") 
				? fileName.substring("/uploads/".length()) 
				: fileName;
			
			// Tạo path đến file
			Path filePath = Paths.get(uploadDir).resolve(actualFileName);
			
			// Kiểm tra file có tồn tại không
			if (!Files.exists(filePath)) {
				return false;
			}
			
			// Kiểm tra security: đảm bảo file nằm trong thư mục uploads
			Path uploadPath = Paths.get(uploadDir).toRealPath();
			Path realFilePath = filePath.toRealPath();
			
			if (!realFilePath.startsWith(uploadPath)) {
				throw new SecurityException("Access denied: File is outside upload directory");
			}
			
			// Xóa file
			return Files.deleteIfExists(filePath);
			
		} catch (IOException e) {
			throw new RuntimeException("Failed to delete file: " + fileName, e);
		} catch (SecurityException e) {
			throw new RuntimeException("Security violation: " + e.getMessage(), e);
		}
	}
	
	/**
	 * Xóa model file từ thư mục uploads/models
	 * @param fileName tên file cần xóa (format: "/uploads/models/filename")
	 * @return true nếu xóa thành công, false nếu không
	 */
	public boolean deleteModelFromServer(String fileName) {
		try {
			// Kiểm tra null và empty
			if (fileName == null || fileName.trim().isEmpty()) {
				return false;
			}
			
			// Loại bỏ prefix "/uploads/models/" để lấy tên file thực
			String actualFileName = fileName.startsWith("/uploads/models/") 
				? fileName.substring("/uploads/models/".length()) 
				: fileName;
			
			// Tạo path đến file
			Path filePath = Paths.get(uploadModelDir).resolve(actualFileName);
			
			// Kiểm tra file có tồn tại không
			if (!Files.exists(filePath)) {
				return false;
			}
			
			// Kiểm tra security: đảm bảo file nằm trong thư mục models
			Path uploadPath = Paths.get(uploadModelDir).toRealPath();
			Path realFilePath = filePath.toRealPath();
			
			if (!realFilePath.startsWith(uploadPath)) {
				throw new SecurityException("Access denied: File is outside models directory");
			}
			
			// Xóa file
			return Files.deleteIfExists(filePath);
			
		} catch (IOException e) {
			throw new RuntimeException("Failed to delete model file: " + fileName, e);
		} catch (SecurityException e) {
			throw new RuntimeException("Security violation: " + e.getMessage(), e);
		}
	}
}
