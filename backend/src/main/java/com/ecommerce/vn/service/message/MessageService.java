package com.ecommerce.vn.service.message;

import java.util.UUID;

import org.springframework.data.domain.Page;

import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.user.User;

public interface MessageService {

	Message createMessage(Message message);
	
	void deleteMessage(UUID messageId);
	
	Page<Message> getMessageByUser(User user, int page, int size);
	
	
}
