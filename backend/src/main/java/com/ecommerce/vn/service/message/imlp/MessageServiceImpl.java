package com.ecommerce.vn.service.message.imlp;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.vn.entity.message.Message;
import com.ecommerce.vn.entity.user.User;
import com.ecommerce.vn.repository.MessageRepository;
import com.ecommerce.vn.service.message.MessageService;

@Service
@Transactional
public class MessageServiceImpl implements MessageService{
	
	@Autowired
	private MessageRepository messageRepository;

	@Override
	public Message createMessage(Message message) {
		if(message.getId() != null) {
			throw new RuntimeException("Message already exist!");
		}
		
		return messageRepository.save(message);
	}

	@Override
	public void deleteMessage(UUID messageId) {
		if(messageId == null) {
			throw new RuntimeException("Message id must not null!");
		}
		
		Optional<Message> message = messageRepository.findById(messageId);
		if(!message.isPresent()) {
			throw new RuntimeException("Cant not find message with id: " + messageId);
		}
		
		
		messageRepository.delete(message.get());
	}

	@Override
	@Transactional(readOnly = true)
	public Page<Message> getMessageByUser(User user, int page, int size) {
		Pageable pageable = PageRequest.of(page, size);
		return messageRepository.getMessageByUsers(user, pageable);
	}

	
}
