package com.ecommerce.vn.service.convert;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.message.MessageCreateRequest;
import com.ecommerce.vn.dto.message.MessageImageResponse;
import com.ecommerce.vn.dto.message.MessageResponse;
import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.message.MessageImage;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.FileUploadService;

@Service
public class MessageConvert {
	
	@Autowired
	private FileUploadService fileUploadService;

	public MessageResponse messageConvertToMessageResponse(Message message) {
		MessageResponse messageResponse = new MessageResponse();
		messageResponse.setId(message.getId());
		messageResponse.setContent(message.getContent());
		messageResponse.setRole(message.getRole());
		messageResponse.setTimestamp(message.getTimestamp());
		messageResponse.setUserId(message.getUser().getId());
		
		messageResponse.setMessageImages(message.getImages().stream().map(messageImage -> messageImageConvertToMessageImageResponse(messageImage)).toList()); 
		
		return messageResponse;
	}
	
	public MessageImageResponse messageImageConvertToMessageImageResponse(MessageImage messageImage) {
		MessageImageResponse messageImageResponse = new MessageImageResponse();
		messageImageResponse.setId(messageImage.getId());
		messageImageResponse.setImageUrl(messageImage.getImageUrl());
		messageImageResponse.setMessageId(messageImage.getMessage().getId());
		
		return messageImageResponse;
	}
	
	
	
	public Message messageCreateRequestConvertToMessage(MessageCreateRequest createRequest, MultipartFile[] images) {
		Message message = new Message();
		message.setContent(createRequest.getContent());
		message.setRole(createRequest.getRole());
		
		User user = new User(createRequest.getUserId());
		
		message.setUser(user);
		
		if(images != null && images.length > 0 && images.length <= 5) {
			Arrays.stream(images).forEach(image -> {
				String imageUrl = fileUploadService.uploadFileToServer(image);
				MessageImage messageImage = new MessageImage();
				messageImage.setImageUrl(imageUrl);
				message.addImage(messageImage);
			});    			
		}
		
		return message;
	}
}
