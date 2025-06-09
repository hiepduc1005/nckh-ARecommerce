package com.ecommerce.vn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.vn.dto.message.MessageCreateRequest;
import com.ecommerce.vn.dto.message.MessageResponse;
import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.service.convert.MessageConvert;
import com.ecommerce.vn.service.message.MessageService;
import com.ecommerce.vn.service.user.UserService;

@RestController
@RequestMapping("api/v1/messages")
public class MessageController {

	@Autowired
	private MessageService messageService;
	
	@Autowired
	private MessageConvert messageConvert;
	
	@Autowired
	private UserService userService;
	
	@PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	public ResponseEntity<MessageResponse> createMessage(
			@RequestPart("message") MessageCreateRequest messageCreateRequest,
			@RequestPart(name = "images", required = false) MultipartFile[] images
			){
		Message message = messageConvert.messageCreateRequestConvertToMessage(messageCreateRequest,images);
		
		message = messageService.createMessage(message);
		
		MessageResponse messageResponse = messageConvert.messageConvertToMessageResponse(message);
		
		return ResponseEntity.ok(messageResponse);
	}
		
	@GetMapping("/user")
	public ResponseEntity<Page<MessageResponse>> getMessageByUser(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "8") int size){
		
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User user = userService.findUserByEmail(email);
		Page<Message> messages = messageService.getMessageByUser(user, page, size);
		
		
		List<MessageResponse> list = messages.stream().map(message -> messageConvert.messageConvertToMessageResponse(message)).toList();
		
		Page<MessageResponse> responsePage = new PageImpl<>(list, messages.getPageable(), messages.getTotalElements());
		
		return ResponseEntity.ok(responsePage);
	}
	
}
