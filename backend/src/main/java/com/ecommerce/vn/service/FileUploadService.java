package com.ecommerce.vn.service;

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
}
