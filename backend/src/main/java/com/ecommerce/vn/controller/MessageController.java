package com.ecommerce.vn.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
	
	@PostMapping
	public ResponseEntity<MessageResponse> createMessage(@RequestBody MessageCreateRequest messageCreateRequest){
		Message message = messageConvert.messageCreateRequestConvertToMessage(messageCreateRequest);
		
		message = messageService.createMessage(message);
		
		MessageResponse messageResponse = messageConvert.messageConvertToMessageResponse(message);
		
		return ResponseEntity.ok(messageResponse);
	}
		
	@GetMapping("/user/{userId}")
	public ResponseEntity<Page<MessageResponse>> getMessageByUser(
			@PathVariable UUID userId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "8") int size){
		
		User user = userService.findUserByUuId(userId);
		Page<Message> messages = messageService.getMessageByUser(user, page, size);
		
		
		List<MessageResponse> list = messages.stream().map(message -> messageConvert.messageConvertToMessageResponse(message)).toList();
		
		Page<MessageResponse> responsePage = new PageImpl<>(list, messages.getPageable(), messages.getTotalElements());
		
		return ResponseEntity.ok(responsePage);
	}
	
}
