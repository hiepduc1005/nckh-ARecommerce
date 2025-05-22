package com.ecommerce.vn.service.convert;

import org.springframework.stereotype.Service;

import com.ecommerce.vn.dto.message.MessageCreateRequest;
import com.ecommerce.vn.dto.message.MessageResponse;
import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.user.User;

@Service
public class MessageConvert {

	public MessageResponse messageConvertToMessageResponse(Message message) {
		MessageResponse messageResponse = new MessageResponse();
		messageResponse.setId(message.getId());
		messageResponse.setContent(message.getContent());
		messageResponse.setRole(message.getRole());
		messageResponse.setTimestamp(message.getTimestamp());
		messageResponse.setUserId(message.getUser().getId());
		
		return messageResponse;
	}
	
	public Message messageCreateRequestConvertToMessage(MessageCreateRequest createRequest) {
		Message message = new Message();
		message.setContent(createRequest.getContent());
		message.setRole(createRequest.getRole());
		
		User user = new User(createRequest.getUserId());
		
		message.setUser(user);
		
		return message;
	}
}
